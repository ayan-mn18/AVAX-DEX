import { motion } from 'framer-motion'
import { Github, Twitter, MessageCircle, ExternalLink } from 'lucide-react'

const Footer = () => {
  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: MessageCircle, href: '#', label: 'Discord' }
  ]

  const quickLinks = [
    { label: 'Documentation', href: '#' },
    { label: 'Analytics', href: '#' },
    { label: 'Bug Bounty', href: '#' },
    { label: 'Governance', href: '#' }
  ]

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1 }}
      className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-lg mt-16"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-avalanche-red to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AX</span>
              </div>
              <span className="text-xl font-bold gradient-text">AVAX Swap</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              A decentralized exchange built on Avalanche for lightning-fast,
              low-cost token swaps. Perfect for learning DeFi development.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={link.label}
                >
                  <link.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1"
                  >
                    <span>{link.label}</span>
                    <ExternalLink size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Network Info */}
          <div>
            <h4 className="font-semibold mb-4">Network</h4>
            <div className="space-y-2">
              <div className="text-slate-400">
                <div className="text-sm">Testnet</div>
                <div className="font-medium text-white">Avalanche Fuji</div>
              </div>
              <div className="text-slate-400">
                <div className="text-sm">Chain ID</div>
                <div className="font-medium text-white">43113</div>
              </div>
              <div className="text-slate-400">
                <div className="text-sm">Status</div>
                <div className="font-medium text-green-400 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 AVAX Swap. Built for educational purposes.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <div className="text-slate-400 text-sm">
              Made with ❤️ for learning DeFi
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
