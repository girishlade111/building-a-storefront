"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/contexts/cart-context"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state, dispatch } = useCart()

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ShopFuture
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Home
            </a>
            <a href="/products" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Products
            </a>
            <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Categories
            </a>
            <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Sale
            </a>
            <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              About
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Heart className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="sm" className="relative" onClick={() => dispatch({ type: "TOGGLE_CART" })}>
              <ShoppingCart className="w-5 h-5" />
              {state.itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                  {state.itemCount}
                </Badge>
              )}
            </Button>

            <Button variant="ghost" size="sm" className="hidden md:flex">
              <User className="w-5 h-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input type="search" placeholder="Search products..." className="pl-10 pr-4 py-2 w-full" />
              </div>
              <a href="#" className="text-gray-700 hover:text-purple-600 font-medium py-2">
                Home
              </a>
              <a href="/products" className="text-gray-700 hover:text-purple-600 font-medium py-2">
                Products
              </a>
              <a href="#" className="text-gray-700 hover:text-purple-600 font-medium py-2">
                Categories
              </a>
              <a href="#" className="text-gray-700 hover:text-purple-600 font-medium py-2">
                Sale
              </a>
              <a href="#" className="text-gray-700 hover:text-purple-600 font-medium py-2">
                About
              </a>
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <Button variant="ghost" size="sm">
                  <Heart className="w-5 h-5" />
                  <span className="ml-2">Wishlist</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <User className="w-5 h-5" />
                  <span className="ml-2">Account</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
