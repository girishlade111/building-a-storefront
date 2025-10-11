"use client"

import { motion } from "framer-motion"
import { Shirt, Watch, Headphones, Gamepad2, Camera, Coffee, Package, Star } from "lucide-react"
import { useCollections } from "@/hooks/use-shopify"

const defaultIcons = [Shirt, Watch, Headphones, Gamepad2, Camera, Coffee, Package, Star]
const defaultColors = [
  "from-pink-500 to-rose-500",
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-indigo-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-amber-500",
  "from-red-500 to-pink-500",
  "from-teal-500 to-cyan-500",
  "from-violet-500 to-purple-500",
]

export function Categories() {
  const { collections, loading, error } = useCollections()

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading collections...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error || collections.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {error
                ? "Unable to load collections from your store"
                : "Create collections in your Shopify store to see them here"}
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Explore our curated collections from your store</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {collections.slice(0, 8).map((collection, index) => {
            const IconComponent = defaultIcons[index % defaultIcons.length]
            const colorClass = defaultColors[index % defaultColors.length]

            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
              >
                <div
                  className={`bg-gradient-to-br ${colorClass} rounded-2xl p-8 text-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  {collection.image?.url ? (
                    <img
                      src={collection.image.url || "/placeholder.svg"}
                      alt={collection.image.altText || collection.title}
                      className="w-12 h-12 mx-auto mb-4 rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <IconComponent className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  )}
                  <h3 className="font-semibold text-lg">{collection.title}</h3>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
