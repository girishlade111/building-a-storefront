"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Gift } from "lucide-react"
import { motion } from "framer-motion"

export function Newsletter() {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 rounded-full p-4">
              <Gift className="w-12 h-12 text-white" />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Get Exclusive Deals</h2>

          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get 20% off your first order plus early access to sales and new arrivals
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input type="email" placeholder="Enter your email" className="pl-10 py-6 text-lg bg-white/90 border-0" />
            </div>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 px-8 py-6 text-lg font-semibold">
              Subscribe
            </Button>
          </div>

          <p className="text-white/70 text-sm mt-4">No spam, unsubscribe at any time</p>
        </motion.div>
      </div>
    </section>
  )
}
