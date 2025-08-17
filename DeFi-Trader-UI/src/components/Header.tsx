import { motion } from 'framer-motion'
import { Wallet, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  isConnected: boolean
  onConnect: () => void
}

const Header = ({ isConnected, onConnect }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-avalanche-red to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AX</span>
            </div>
            <span className="text-xl font-bold gradient-text">AVAX Swap</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-300 hover:text-white transition-colors">
              Swap
            </a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">
              Pool
            </a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">
              Analytics
            </a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">
              Docs
            </a>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={onConnect}
              className={`btn-primary flex items-center space-x-2 ${isConnected ? 'bg-green-600 hover:bg-green-700' : ''
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Wallet size={20} />
              <span>
                {isConnected ? '0x742d...c42e' : 'Connect Wallet'}
              </span>
            </motion.button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-slate-700"
          >
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                Swap
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                Pool
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                Analytics
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                Docs
              </a>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  )
}

export default Header
