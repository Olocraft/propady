
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { GlobeIcon, ShieldCheck, Layers, Search } from 'lucide-react';

const features = [
  {
    title: "Global Market",
    description: "Explore investment opportunities across the world without geographical limitations.",
    icon: <GlobeIcon size={32} className="text-propady-mint" />,
    buttonText: "See More",
  },
  {
    title: "Secure Transactions",
    description: "Leverage blockchain technology for secure and transparent interactions.",
    icon: <ShieldCheck size={32} className="text-propady-mint" />,
    buttonText: "See More",
  },
  {
    title: "Fractional Ownership",
    description: "Invest in portions of properties, making real estate accessible to everyone.",
    icon: <Layers size={32} className="text-propady-mint" />,
    buttonText: "See More",
  },
  {
    title: "Browse Listings",
    description: "Find properties that match your investment goals.",
    icon: <Search size={32} className="text-propady-mint" />,
    buttonText: "See More",
  }
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-morphism rounded-xl p-6 h-full flex flex-col justify-between transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg"
    >
      <div>
        <div className="mb-4 flex items-center justify-center md:justify-start">
          {feature.icon}
        </div>
        <h3 className="text-xl font-semibold mb-3 text-white text-center md:text-left">{feature.title}</h3>
        <p className="text-white/70 mb-4 text-center md:text-left">{feature.description}</p>
      </div>
      <Button variant="default" className="bg-propady-purple hover:bg-propady-purple-light text-white w-full">
        {feature.buttonText}
      </Button>
    </motion.div>
  );
};

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-black z-0" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why Choose Propady</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
