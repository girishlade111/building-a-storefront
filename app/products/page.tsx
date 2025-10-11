"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useProducts } from "@/hooks/use-shopify"
import { useCart } from "@/contexts/cart-context"
import { Heart, ShoppingCart, Search, Filter, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"

export default function ProductsPage() {
  const { products, loading, error } = useProducts()
  const { addItem, state: cartState } = useCart()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("featured")

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

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading || cartState.loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">Error loading products:</p>
            <p className="text-red-500 text-sm mb-4 break-words max-w-lg mx-auto">{error}</p>
            <p className="text-gray-600 mb-4">
              Please ensure your `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` environment variable is correctly set to your
              Shopify store URL (e.g., `your-store-name.myshopify.com`).
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">All Products</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our complete collection of amazing products
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg bg-white"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>

            <Button variant="outline" className="px-6 bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => {
              const variant = product.variants.edges[0]?.node
              const image = product.images.edges[0]?.node
              const price = variant ? Number.parseFloat(variant.price.amount) : 0
              const compareAtPrice = product.compareAtPriceRange.minVariantPrice.amount
              const hasDiscount = compareAtPrice && Number.parseFloat(compareAtPrice) > price

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <Link href={`/product/${product.handle}`}>
                          <img
                            src={image?.url || "/placeholder.svg"}
                            alt={image?.altText || product.title}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                          />
                        </Link>

                        {hasDiscount && <Badge className="absolute top-4 left-4 bg-red-500 text-white">Sale</Badge>}

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
                            Quick Add
                          </Button>
                        </div>
                      </div>

                      <div className="p-6">
                        <Link href={`/product/${product.handle}`}>
                          <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors cursor-pointer">
                            {product.title}
                          </h3>
                        </Link>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</span>
                          {hasDiscount && (
                            <>
                              <span className="text-lg text-gray-500 line-through">
                                ${Number.parseFloat(compareAtPrice).toFixed(2)}
                              </span>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                {Math.round(
                                  ((Number.parseFloat(compareAtPrice) - price) / Number.parseFloat(compareAtPrice)) *
                                    100,
                                )}
                                % OFF
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
      </div>
    </div>
  )
}
