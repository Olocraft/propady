
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import BlockchainSection from '@/components/home/BlockchainSection';
import FAQ from '@/components/home/FAQ';
import { motion } from 'framer-motion';

const Index = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-white overflow-hidden">
      <Navbar />
      <Hero />
      <Features />
      
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-background z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-4xl font-bold mb-12 text-white text-center"
          >
            What you would find
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Real Estate Agency services",
                image: "/lovable-uploads/f1596ace-2921-4601-bd8b-5cb0e20550ff.png"
              },
              {
                title: "Property Pricing using Statistics",
                image: "/lovable-uploads/edc21d9c-84ce-44b2-8047-f5d2e076e9c9.png"
              },
              {
                title: "Crowd-Funding Projects",
                image: "/lovable-uploads/99b9e28a-439c-4750-90ce-22d5c7d601af.png"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 mb-4 overflow-hidden rounded-2xl">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium text-white text-center">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <BlockchainSection />
      <FAQ />
      
      <footer className="py-6 bg-black">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-propady-mint rounded-lg"></div>
              <span className="relative text-black font-bold text-lg">P</span>
            </div>
            <span className="text-white font-bold">Propady</span>
          </div>
          <div className="text-white/60 text-sm">© 2024 Propady</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
