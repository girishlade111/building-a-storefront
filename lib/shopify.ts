const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN

if (!SHOPIFY_STORE_DOMAIN) {
  throw new Error(
    "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not set. Please set your Shopify store domain in the environment variables.",
  )
}

const SHOPIFY_STOREFRONT_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2025-07/graphql.json`

export interface ShopifyProduct {
  id: string
  title: string
  description: string
  handle: string
  images: {
    edges: Array<{
      node: {
        url: string
        altText: string
      }
    }>
  }
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  variants: {
    edges: Array<{
      node: {
        id: string
        title: string
        price: {
          amount: string
          currencyCode: string
        }
        availableForSale: boolean
      }
    }>
  }
}

export interface ShopifyCollection {
  id: string
  title: string
  handle: string
  description: string
  image?: {
    url: string
    altText: string
  }
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    price: {
      amount: string
      currencyCode: string
    }
    product: {
      title: string
      handle: string
      images: {
        edges: Array<{
          node: {
            url: string
            altText: string
          }
        }>
      }
    }
  }
}

export interface ShopifyCart {
  id: string
  lines: {
    edges: Array<{ node: ShopifyCartLine }>
  }
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
    totalTaxAmount: {
      amount: string
      currencyCode: string
    }
  }
  checkoutUrl: string
}

// Tokenless Shopify API request
async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string
  variables?: Record<string, any>
}): Promise<{ data: T; errors?: any[] }> {
  try {
    const response = await fetch(SHOPIFY_STOREFRONT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: "no-store", // Ensure fresh data for cart operations
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Shopify API HTTP error! Status: ${response.status}, Body: ${errorBody}`)
    }

    const json = await response.json()

    if (json.errors) {
      console.error("Shopify API errors:", json.errors)
      throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`)
    }

    return json
  } catch (error) {
    console.error("Shopify fetch error:", error)
    throw error
  }
}

// Get all products
export async function getProducts(first = 20): Promise<ShopifyProduct[]> {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `

  const { data } = await shopifyFetch<{
    products: {
      edges: Array<{ node: ShopifyProduct }>
    }
  }>({
    query,
    variables: { first },
  })

  return data.products.edges.map((edge) => edge.node)
}

// Get single product by handle
export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        handle
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  `

  const { data } = await shopifyFetch<{
    product: ShopifyProduct | null
  }>({
    query,
    variables: { handle },
  })

  return data.product
}

// Get collections
export async function getCollections(first = 10): Promise<ShopifyCollection[]> {
  const query = `
    query getCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `

  const { data } = await shopifyFetch<{
    collections: {
      edges: Array<{ node: ShopifyCollection }>
    }
  }>({
    query,
    variables: { first },
  })

  return data.collections.edges.map((edge) => edge.node)
}

// Create cart
export async function createCart(): Promise<ShopifyCart> {
  const query = `
    mutation cartCreate {
      cartCreate {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const { data } = await shopifyFetch<{
    cartCreate: {
      cart: ShopifyCart
      userErrors: Array<{ field: string; message: string }>
    }
  }>({ query })

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message)
  }

  return data.cartCreate.cart
}

// Add items to cart
export async function addCartLines(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>,
): Promise<ShopifyCart> {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const { data } = await shopifyFetch<{
    cartLinesAdd: {
      cart: ShopifyCart
      userErrors: Array<{ field: string; message: string }>
    }
  }>({
    query,
    variables: {
      cartId,
      lines,
    },
  })

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message)
  }

  return data.cartLinesAdd.cart
}

// Update items in cart
export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>,
): Promise<ShopifyCart> {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const { data } = await shopifyFetch<{
    cartLinesUpdate: {
      cart: ShopifyCart
      userErrors: Array<{ field: string; message: string }>
    }
  }>({
    query,
    variables: {
      cartId,
      lines,
    },
  })

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message)
  }

  return data.cartLinesUpdate.cart
}

// Remove items from cart
export async function removeCartLines(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const { data } = await shopifyFetch<{
    cartLinesRemove: {
      cart: ShopifyCart
      userErrors: Array<{ field: string; message: string }>
    }
  }>({
    query,
    variables: {
      cartId,
      lineIds,
    },
  })

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors[0].message)
  }

  return data.cartLinesRemove.cart
}

// Get cart
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
        checkoutUrl
      }
    }
  `

  const { data } = await shopifyFetch<{
    cart: ShopifyCart | null
  }>({
    query,
    variables: { cartId },
  })

  return data.cart
}
