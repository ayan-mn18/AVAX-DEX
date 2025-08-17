import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpDown, Settings, RefreshCw, Zap } from 'lucide-react'

// Dummy token data
const tokens = [
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    balance: '12.5432',
    price: 23.45,
    logo: '🔺'
  },
  {
    symbol: 'TokenA',
    name: 'Test Token A',
    balance: '1,250.00',
    price: 1.25,
    logo: '🟡'
  },
  {
    symbol: 'TokenB',
    name: 'Test Token B',
    balance: '850.75',
    price: 2.10,
    logo: '🔵'
  }
]

const SwapInterface = () => {
  const [fromToken, setFromToken] = useState(tokens[0])
  const [toToken, setToToken] = useState(tokens[1])
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [slippage, setSlippage] = useState(0.5)

  // Mock exchange rate calculation
  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      const rate = fromToken.price / toToken.price
      setToAmount((parseFloat(fromAmount) * rate * 0.997).toFixed(6)) // 0.3% fee simulation
    } else {
      setToAmount('')
    }
  }, [fromAmount, fromToken, toToken])

  const handleSwapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) === 0) return

    setIsLoading(true)
    // Simulate transaction time
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)

    // Reset form after successful swap
    setFromAmount('')
    setToAmount('')
  }

  const isSwapDisabled = !fromAmount || parseFloat(fromAmount) === 0 || parseFloat(fromAmount) > parseFloat(fromToken.balance)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card-glow max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">Swap Tokens</h2>
        <motion.button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          <Settings size={20} />
        </motion.button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-600"
          >
            <h3 className="text-sm font-semibold mb-3">Transaction Settings</h3>
            <div>
              <label className="text-sm text-slate-300">Slippage Tolerance</label>
              <div className="flex space-x-2 mt-2">
                {[0.1, 0.5, 1.0].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={`px-3 py-1 rounded text-sm ${slippage === value
                        ? 'bg-avalanche-red text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* From Token */}
      <div className="space-y-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">From</span>
            <span className="text-sm text-slate-400">
              Balance: {fromToken.balance}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-700 px-3 py-2 rounded-lg min-w-fit">
              <span className="text-2xl">{fromToken.logo}</span>
              <span className="font-semibold">{fromToken.symbol}</span>
            </div>
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-right text-2xl font-semibold focus:outline-none"
            />
          </div>
          <div className="text-right text-sm text-slate-400 mt-1">
            ≈ ${fromAmount ? (parseFloat(fromAmount) * fromToken.price).toFixed(2) : '0.00'}
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <motion.button
            onClick={handleSwapTokens}
            className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUpDown size={20} />
          </motion.button>
        </div>

        {/* To Token */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">To</span>
            <span className="text-sm text-slate-400">
              Balance: {toToken.balance}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-700 px-3 py-2 rounded-lg min-w-fit">
              <span className="text-2xl">{toToken.logo}</span>
              <span className="font-semibold">{toToken.symbol}</span>
            </div>
            <div className="flex-1 text-right text-2xl font-semibold text-slate-300">
              {toAmount || '0.0'}
            </div>
          </div>
          <div className="text-right text-sm text-slate-400 mt-1">
            ≈ ${toAmount ? (parseFloat(toAmount) * toToken.price).toFixed(2) : '0.00'}
          </div>
        </div>
      </div>

      {/* Exchange Rate Info */}
      {fromAmount && toAmount && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-slate-800 rounded-lg border border-slate-600"
        >
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Exchange Rate</span>
            <span>1 {fromToken.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken.symbol}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-slate-400">Price Impact</span>
            <span className="text-green-400">&lt; 0.01%</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-slate-400">Liquidity Provider Fee</span>
            <span>0.30%</span>
          </div>
        </motion.div>
      )}

      {/* Swap Button */}
      <motion.button
        onClick={handleSwap}
        disabled={isSwapDisabled || isLoading}
        className={`w-full mt-6 btn-primary flex items-center justify-center space-x-2 ${isSwapDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        whileHover={!isSwapDisabled ? { scale: 1.02 } : {}}
        whileTap={!isSwapDisabled ? { scale: 0.98 } : {}}
      >
        {isLoading ? (
          <>
            <RefreshCw className="animate-spin" size={20} />
            <span>Swapping...</span>
          </>
        ) : (
          <>
            <Zap size={20} />
            <span>
              {!fromAmount
                ? 'Enter Amount'
                : parseFloat(fromAmount) > parseFloat(fromToken.balance)
                  ? 'Insufficient Balance'
                  : 'Swap Tokens'}
            </span>
          </>
        )}
      </motion.button>

      {/* Gas Fee Estimate */}
      <div className="mt-4 text-center text-sm text-slate-400">
        Estimated Gas Fee: ~0.0023 AVAX ($0.05)
      </div>
    </motion.div>
  )
}

export default SwapInterface
