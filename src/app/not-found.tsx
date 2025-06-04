'use client'

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NotFound = () => {
  const path = usePathname();

  console.error(
    "404 Error: User attempted to access non-existent route: ",
    path
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-propady-purple/20 blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-propady-mint/10 blur-3xl" />
      </div>

      <motion.div
        className="text-center relative z-10 p-8 glass-morphism rounded-xl max-w-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-6xl font-bold mb-4 text-gradient"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          404
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-xl text-white mb-8">
            The property you&apos;re looking for doesn&apos;t exist in our
            blockchain.
          </p>
          <Link href="/">
            <Button className="bg-propady-purple hover:bg-propady-purple-light text-white">
              <Home className="mr-2 h-4 w-4" /> Return Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
