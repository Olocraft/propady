
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CryptoPayment from '@/components/payment/CryptoPayment';

const CryptoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const cryptoOptions = [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=024',
      description: 'The leading smart contract platform with widespread adoption in real estate tokenization.',
      amount: 2000
    },
    {
      name: 'Sui',
      symbol: 'SUI',
      icon: 'https://cryptologos.cc/logos/sui-sui-logo.svg?v=024',
      description: 'Ultra-fast, low-cost blockchain perfect for high-volume property transactions.',
      amount: 5000
    },
    {
      name: 'Klaytn',
      symbol: 'KLAY',
      icon: 'https://cryptologos.cc/logos/klaytn-klay-logo.svg?v=024',
      description: 'Enterprise-grade blockchain with compliance features for institutional property investments.',
      amount: 1000
    }
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      className="mt-16 mb-16"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Pay with Cryptocurrency</h2>
      <div className="glass-morphism border-white/10 rounded-xl p-6">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-white mb-2">Fast, Secure, and Transparent</h3>
          <p className="text-white/70">Use your preferred cryptocurrency to easily purchase properties on our platform</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cryptoOptions.map((option, index) => (
            <div key={index} className="bg-black/20 rounded-xl p-6 flex flex-col h-full">
              <div className="flex items-center mb-4">
                <img src={option.icon} alt={option.name} className="w-10 h-10 mr-3" />
                <div>
                  <h4 className="font-medium text-white">{option.name}</h4>
                  <p className="text-sm text-white/70">{option.symbol}</p>
                </div>
              </div>
              <p className="text-white/70 mb-6 text-sm flex-grow">{option.description}</p>
              <CryptoPayment amount={option.amount} variant="full" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CryptoSection;
