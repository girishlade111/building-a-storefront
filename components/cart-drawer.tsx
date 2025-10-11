"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { X, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export function CartDrawer() {
  const { state, dispatch, removeItem, updateItemQuantity, clearShopifyCart } = useCart()

  const handleUpdateQuantity = (cartLineId: string, quantity: number) => {
    updateItemQuantity(cartLineId, quantity)
  }

  const handleRemoveItem = (cartLineId: string) => {
    removeItem(cartLineId)
  }

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" })
  }

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeCart}
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              <Button variant="ghost" size="sm" onClick={closeCart}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Loading/Error State */}
            {state.loading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              </div>
            )}
            {state.error && (
              <div className="p-4 bg-red-100 text-red-700 text-sm text-center">
                Error: {state.error}. Please refresh or try again.
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {state.items.length === 0 && !state.loading ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add some products to get started</p>
                  <Button onClick={closeCart} className="bg-gradient-to-r from-purple-600 to-pink-600">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.cartLineId || item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />

                      <div className="flex-1">
                        <Link href={`/product/${item.handle}`} onClick={closeCart}>
                          <h3 className="font-medium text-gray-900 hover:text-purple-600 transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>

                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => item.cartLineId && handleUpdateQuantity(item.cartLineId, item.quantity - 1)}
                            className="w-8 h-8 p-0"
                            disabled={state.loading}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <span className="w-8 text-center font-medium">{item.quantity}</span>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => item.cartLineId && handleUpdateQuantity(item.cartLineId, item.quantity + 1)}
                            className="w-8 h-8 p-0"
                            disabled={state.loading}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => item.cartLineId && handleRemoveItem(item.cartLineId)}
                          className="text-red-500 hover:text-red-700 mt-1"
                          disabled={state.loading}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={state.loading || !state.checkoutUrl}
                  >
                    <a href={state.checkoutUrl || "#"} target="_blank" rel="noopener noreferrer">
                      Checkout
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={closeCart}
                    disabled={state.loading}
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-red-500 hover:text-red-700"
                    onClick={clearShopifyCart}
                    disabled={state.loading}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
