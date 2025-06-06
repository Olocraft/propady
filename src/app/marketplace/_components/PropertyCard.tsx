import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import InvestmentModal from "./InvestmentModal";
import Img from "@/components/Img";

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  image: string;
  location: string;
  agency: string;
  verified: boolean;
  roi: string;
  annualReturn: string;
  supportedChains?: string[];
  className?: string;
  variant?: "default" | "compact";
}

const PropertyCard = ({
  id,
  title,
  price,
  image,
  location,
  agency,
  verified,
  roi,
  annualReturn,
  supportedChains = [],
  className,
  variant = "default",
}: PropertyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Chain icon mapping
  const chainIcons = {
    ethereum: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=024",
    solana: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=024",
    polygon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=024",
    binance: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=024",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-xl card-hover",
        variant === "default" ? "bg-white/5" : "bg-white/10",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/property/${id}`} className="block">
        <div className="relative">
          <Img
            src={image}
            alt={title}
            className={cn(
              "w-full h-48 object-cover transition-all duration-500",
              variant === "compact" ? "h-32" : "h-48",
              isHovered ? "scale-110" : "scale-100"
            )}
          />
          {verified && (
            <div className="absolute top-3 right-3 glass-morphism px-2 py-1 rounded-md text-xs text-propady-mint">
              verified
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-white mb-1">{title}</h3>
              <div className="flex items-center text-sm text-white/70 mb-2">
                <MapPin size={14} className="mr-1" />
                <span>{location}</span>
              </div>
              <div className="text-xs text-white/60">{agency}</div>
            </div>
            <div className="text-xl font-bold text-white">{price}</div>
          </div>

          {variant === "default" && (
            <>
              <div className="flex mt-4 space-x-2">
                {supportedChains.map((chain) => {
                  const iconKey =
                    chain.toLowerCase() as keyof typeof chainIcons;
                  const iconUrl = chainIcons[iconKey];
                  return iconUrl ? (
                    <Img
                      key={chain}
                      src={iconUrl}
                      alt={chain}
                      className="w-5 h-5"
                    />
                  ) : null;
                })}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-propady-purple rounded-lg p-2 text-center">
                  <div className="text-xs text-white/70">Total ROI</div>
                  <div className="font-bold text-white">{roi}</div>
                </div>
                <div className="bg-propady-mint rounded-lg p-2 text-center">
                  <div className="text-xs text-black/70">Ann. Ret.</div>
                  <div className="font-bold text-black">{annualReturn}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </Link>

      {variant === "default" && (
        <div className="p-4 pt-0 grid grid-cols-2 gap-2">
          <Link href={`/property/${id}`}>
            <Button
              variant="outline"
              className="w-full bg-white/5 hover:bg-white/10 text-white border-white/20"
            >
              Inspect
            </Button>
          </Link>
          <InvestmentModal
            propertyId={id}
            title={title}
            price={price}
            image={image}
            location={location}
            roi={roi}
            annualReturn={annualReturn}
          >
            <Button
              variant="default"
              className="w-full bg-black text-white hover:bg-black/80"
            >
              Invest
            </Button>
          </InvestmentModal>
        </div>
      )}
    </motion.div>
  );
};

export default PropertyCard;
