import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import SwapInterface from './components/SwapInterface'
import Stats from './components/Stats'
import Footer from './components/Footer'

function App() {
  const [isConnected, setIsConnected] = useState(false)

  const handleConnectWallet = () => {
    // Simulate wallet connection
    setIsConnected(!isConnected)
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <motion.div
          className="absolute top-10 left-10 w-72 h-72 bg-red-600 opacity-10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Header isConnected={isConnected} onConnect={handleConnectWallet} />

        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4">
              <span className="gradient-text">AVAX</span> Token Swap
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Experience lightning-fast token swaps on Avalanche's Fuji Testnet.
              Learn DeFi while trading with zero risk.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-2">
              <SwapInterface />
            </div>
            <div>
              <Stats />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
