
'use client'

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";
import CryptoPayment from './payment/CryptoPayment';
import Img from '@/components/Img';

const blockchains = [
  {
    name: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=024",
    description: "Industry-leading smart contract platform with robust security and widespread adoption for real estate tokenization.",
    buttonText: "Use Wallet"
  },
  {
    name: "Sui Chain",
    logo: "https://cryptologos.cc/logos/sui-sui-logo.svg?v=024",
    description: "Next-generation blockchain with ultra-fast finality and low transaction costs ideal for high-volume real estate markets.",
    buttonText: "Use Wallet"
  },
  {
    name: "Kaikas",
    logo: "https://cryptologos.cc/logos/klaytn-klay-logo.svg?v=024",
    description: "Enterprise-focused blockchain platform offering scalability and compliance features for institutional real estate investments.",
    buttonText: "Use Wallet"
  }
];

const BlockchainCard = ({ blockchain, index }: { blockchain: typeof blockchains[0], index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-morphism rounded-xl p-6 flex flex-col h-full"
    >
      <div className="flex flex-col items-center mb-4">
        <Img src={blockchain.logo} alt={blockchain.name} className="w-16 h-16 mb-4" />
        <h3 className="text-xl font-semibold text-white">{blockchain.name}</h3>
      </div>
      <p className="text-white/70 mb-6 text-center flex-grow">{blockchain.description}</p>
      <Button 
        variant="default" 
        className="w-full bg-propady-purple hover:bg-propady-purple-light text-white"
        onClick={() => document.getElementById(`crypto-payment-${index}`)?.click()}
      >
        {blockchain.buttonText}
      </Button>
      <div className="hidden">
        <CryptoPayment 
          amount={1000} 
          variant="button" 
          // @ts-ignore - This is fine for our hidden trigger
          id={`crypto-payment-${index}`}
        />
      </div>
    </motion.div>
  );
};

const BlockchainSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-background z-0" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Powered by leading blockchains</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Use your preferred cryptocurrency to securely and transparently purchase or invest in properties on our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blockchains.map((blockchain, index) => (
            <BlockchainCard key={index} blockchain={blockchain} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlockchainSection;
