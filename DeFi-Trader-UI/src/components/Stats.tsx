import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Users, Activity } from 'lucide-react'

const statsData = [
  {
    title: 'Total Volume (24h)',
    value: '$1,234,567',
    change: '+12.5%',
    icon: DollarSign,
    positive: true
  },
  {
    title: 'Total Liquidity',
    value: '$8,456,789',
    change: '+5.2%',
    icon: Activity,
    positive: true
  },
  {
    title: 'Active Users',
    value: '2,847',
    change: '+18.3%',
    icon: Users,
    positive: true
  },
  {
    title: 'AVAX Price',
    value: '$23.45',
    change: '-2.1%',
    icon: TrendingUp,
    positive: false
  }
]

const topPairs = [
  { pair: 'AVAX/TokenA', volume: '$456,789', apr: '15.6%' },
  { pair: 'TokenA/TokenB', volume: '$234,567', apr: '22.1%' },
  { pair: 'AVAX/TokenB', volume: '$123,456', apr: '18.9%' }
]

const Stats = () => {
  return (
    <div className="space-y-6">
      {/* Protocol Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="card-glow"
      >
        <h3 className="text-xl font-bold mb-4 gradient-text">Protocol Stats</h3>
        <div className="space-y-4">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-750 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-700 rounded-lg">
                  <stat.icon size={16} className="text-avalanche-red" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{stat.title}</p>
                  <p className="font-semibold">{stat.value}</p>
                </div>
              </div>
              <span
                className={`text-sm font-medium ${stat.positive ? 'text-green-400' : 'text-red-400'
                  }`}
              >
                {stat.change}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Top Trading Pairs */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card-glow"
      >
        <h3 className="text-xl font-bold mb-4 gradient-text">Top Pairs</h3>
        <div className="space-y-3">
          {topPairs.map((pair, index) => (
            <motion.div
              key={pair.pair}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="p-3 bg-slate-800 rounded-lg hover:bg-slate-750 transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{pair.pair}</span>
                <span className="text-green-400 text-sm font-medium">
                  APR {pair.apr}
                </span>
              </div>
              <div className="text-slate-400 text-sm">
                Volume: {pair.volume}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="card-glow"
      >
        <h3 className="text-xl font-bold mb-4 gradient-text">Quick Actions</h3>
        <div className="space-y-3">
          <motion.button
            className="w-full btn-secondary text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-center">
              <span>Add Liquidity</span>
              <span className="text-green-400">Earn Fees</span>
            </div>
          </motion.button>

          <motion.button
            className="w-full btn-secondary text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-center">
              <span>Farm Tokens</span>
              <span className="text-yellow-400">Up to 45% APR</span>
            </div>
          </motion.button>

          <motion.button
            className="w-full btn-secondary text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-center">
              <span>Bridge Assets</span>
              <span className="text-blue-400">Cross-chain</span>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Network Info */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="card-glow"
      >
        <h3 className="text-xl font-bold mb-4 gradient-text">Network</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Network</span>
            <span className="font-medium">Avalanche Fuji</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Block Time</span>
            <span className="font-medium">~2 seconds</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Gas Price</span>
            <span className="font-medium">25 nAVAX</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Finality</span>
            <span className="font-medium text-green-400">Instant</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Stats
