"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useCart } from "@/contexts/cart-context"
import { useProducts } from "@/hooks/use-shopify"
import Link from "next/link"

export function FeaturedProducts() {
  const { products, loading, error } = useProducts()
  const { addItem, state: cartState } = useCart()

  const handleAddToCart = async (product: any) => {
    const variant = product.variants.edges[0]?.node
    if (variant) {
      await addItem({
        id: variant.id,
        name: product.title,
        price: Number.parseFloat(variant.price.amount),
        image: product.images.edges[0]?.node.url || "/placeholder.svg",
        handle: product.handle,
      })
    }
  }

  if (loading || cartState.loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading featured products...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading featured products:</p>
            <p className="text-red-500 text-sm mb-4 break-words max-w-lg mx-auto">{error}</p>
            <p className="text-gray-600 text-sm">
              Please ensure your `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` environment variable is correctly set to your
              Shopify store URL (e.g., `your-store-name.myshopify.com`).
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Take first 6 products as featured
  const featuredProducts = products.slice(0, 6)

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Handpicked items from your store</p>
        </motion.div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No products found in your Shopify store</p>
            <p className="text-gray-500">Add some products to your Shopify store to see them here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => {
              const variant = product.variants.edges[0]?.node
              const image = product.images.edges[0]?.node
              const price = variant ? Number.parseFloat(variant.price.amount) : 0
              const compareAtPrice = product.compareAtPriceRange.minVariantPrice.amount
              const hasDiscount = compareAtPrice && Number.parseFloat(compareAtPrice) > price
              const discount = hasDiscount
                ? Math.round(((Number.parseFloat(compareAtPrice) - price) / Number.parseFloat(compareAtPrice)) * 100)
                : 0

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <Link href={`/product/${product.handle}`}>
                          <img
                            src={image?.url || "/placeholder.svg?height=300&width=300"}
                            alt={image?.altText || product.title}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                          />
                        </Link>

                        {hasDiscount && (
                          <Badge className="absolute top-4 left-4 bg-red-500 text-white">{discount}% OFF</Badge>
                        )}

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button
                            className="bg-white text-black hover:bg-gray-100"
                            onClick={() => handleAddToCart(product)}
                            disabled={!variant?.availableForSale || cartState.loading}
                          >
                            {cartState.loading ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              <ShoppingCart className="w-4 h-4 mr-2" />
                            )}
                            {variant?.availableForSale ? "Quick Add" : "Out of Stock"}
                          </Button>
                        </div>
                      </div>

                      <div className="p-6">
                        <Link href={`/product/${product.handle}`}>
                          <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors cursor-pointer line-clamp-2">
                            {product.title}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</span>
                          {hasDiscount && (
                            <>
                              <span className="text-lg text-gray-500 line-through">
                                ${Number.parseFloat(compareAtPrice).toFixed(2)}
                              </span>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                {discount}% OFF
                              </Badge>
                            </>
                          )}
                        </div>

                        <Button
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          onClick={() => handleAddToCart(product)}
                          disabled={!variant?.availableForSale || cartState.loading}
                        >
                          {cartState.loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Add to Cart"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/products">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
              View All Products
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
