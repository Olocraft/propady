"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Img from "@/components/Img";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.4;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background gradient with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-propady-purple-dark via-background to-background z-0" />

      {/* Animated particle effect */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            suppressHydrationWarning
            className="absolute w-1 h-1 rounded-full bg-propady-mint/30"
            initial={{
              x: Math.random() * 500,
              y: Math.random() * 500,
              opacity: Math.random() * 0.5 + 0.3,
              scale: Math.random() * 1 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * -200],
              opacity: [null, Math.random() * 0.8 + 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Holographic circles */}
      <motion.div
        className="absolute right-[-10%] top-[20%] w-[400px] h-[400px] rounded-full bg-propady-mint/5 blur-3xl z-0"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ translateY: -parallaxOffset * 0.3 }}
      />

      <motion.div
        className="absolute left-[-5%] bottom-[10%] w-[300px] h-[300px] rounded-full bg-propady-purple/10 blur-3xl z-0"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ translateY: -parallaxOffset * 0.5 }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-gradient">
                The Future of Real Estate and RWAs:
              </span>
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient-primary">
              Decentralized, Transparent
            </h2>
          </motion.div>

          <motion.p
            className="text-lg text-white/80 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Propady is a marketplace for buying, selling and managing
            properties. Building on the blockchain technology to enhance
            transparency and security, making real estate investing accessible
            to everyone.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button className="bg-propady-purple hover:bg-propady-purple-light text-white px-8 py-6 rounded-xl text-lg font-medium">
              Join our Waitlist
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-xl text-lg font-medium"
            >
              Try Demo
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Floating property card */}
      <motion.div
        className="absolute right-[5%] top-[40%] w-[350px] glass-morphism rounded-xl overflow-hidden shadow-2xl hidden lg:block"
        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        style={{ translateY: -parallaxOffset * 0.8 }}
      >
        <Img
          src="/lovable-uploads/9cf1c88a-5f50-447e-a034-cb6515047de2.png"
          alt="Property preview"
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-white">
                Bungalow Terrace
              </h3>
              <div className="text-sm text-white/70">Lekki, Lagos</div>
            </div>
            <div className="text-xl font-bold text-white">$130k</div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-propady-purple/70 rounded-lg p-2 text-center">
              <div className="text-xs text-white/70">Total ROI</div>
              <div className="font-bold text-white">12.08%</div>
            </div>
            <div className="bg-propady-mint/70 rounded-lg p-2 text-center">
              <div className="text-xs text-black/70">Ann. Ret.</div>
              <div className="font-bold text-black">12.08%</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
