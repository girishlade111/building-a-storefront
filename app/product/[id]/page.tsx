"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { Heart, ShoppingCart, Truck, Shield, RotateCcw, ArrowLeft, Loader2 } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useProduct } from "@/hooks/use-shopify"

export default function ProductPage({ params }: { params: { id: string } }) {
  const { product, loading, error } = useProduct(params.id)
  const { addItem, state: cartState } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")

  if (loading || cartState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">This product doesn't exist in your Shopify store</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const variant = product.variants.edges[0]?.node
  const images = product.images.edges.map((edge) => edge.node)
  const price = variant ? Number.parseFloat(variant.price.amount) : 0
  const compareAtPrice = product.compareAtPriceRange.minVariantPrice.amount
  const hasDiscount = compareAtPrice && Number.parseFloat(compareAtPrice) > price
  const discount = hasDiscount
    ? Math.round(((Number.parseFloat(compareAtPrice) - price) / Number.parseFloat(compareAtPrice)) * 100)
    : 0

  const handleAddToCart = async () => {
    if (variant) {
      await addItem(
        {
          id: variant.id,
          name: product.title,
          price: price,
          image: images[0]?.url || "/placeholder.svg",
          handle: product.handle,
        },
        quantity,
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={images[selectedImage]?.url || "/placeholder.svg?height=500&width=500"}
                alt={images[selectedImage]?.altText || product.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-purple-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {hasDiscount && <Badge className="bg-red-500 text-white mb-4">{discount}% OFF</Badge>}

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">${price.toFixed(2)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${Number.parseFloat(compareAtPrice).toFixed(2)}
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {discount}% OFF
                    </Badge>
                  </>
                )}
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description || "No description available for this product."}
                </p>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                    disabled={cartState.loading}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                    disabled={cartState.loading}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">{variant?.availableForSale ? "In stock" : "Out of stock"}</span>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!variant?.availableForSale || cartState.loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6 disabled:opacity-50"
                >
                  {cartState.loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <ShoppingCart className="w-5 h-5 mr-2" />
                  )}
                  {variant?.availableForSale ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button variant="outline" size="lg" className="px-6 bg-transparent" disabled={cartState.loading}>
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4 text-green-600" />
                Free Shipping
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-blue-600" />
                Secure Payment
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RotateCcw className="w-4 h-4 text-purple-600" />
                Easy Returns
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {["description", "details"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description || "No detailed description available for this product."}
                </p>
              </div>
            )}

            {activeTab === "details" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-900">Product ID:</span>
                    <span className="text-gray-600">{product.id.split("/").pop()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-900">Handle:</span>
                    <span className="text-gray-600">{product.handle}</span>
                  </div>
                  {variant && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-900">Variant:</span>
                      <span className="text-gray-600">{variant.title}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
