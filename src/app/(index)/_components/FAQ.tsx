'use client'

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus } from 'lucide-react';

const faqs = [
  {
    question: "What is Propady For",
    answer: "Propady is a blockchain-powered real estate marketplace that enables property tokenization, fractional ownership, and transparent transactions. It allows investors to diversify their portfolio with real estate assets at a fraction of the traditional cost."
  },
  {
    question: "Who Can Use Propady",
    answer: "Anyone interested in real estate investment can use Propady. This includes first-time investors looking for affordable entry into real estate, experienced investors seeking portfolio diversification, property developers looking for funding, and real estate agencies wanting to leverage blockchain technology."
  },
  {
    question: "Do you understand what the metaverse is",
    answer: "The metaverse is a collective virtual shared space, created by the convergence of virtually enhanced physical reality and physically persistent virtual reality. At Propady, we're exploring how real estate in the metaverse connects with traditional property investment, creating new opportunities for our users in both digital and physical worlds."
  },
  {
    question: "What is Property fractionation",
    answer: "Property fractionation is the process of dividing a real estate asset into smaller, tradable tokens on the blockchain. This allows multiple investors to own portions of a property, reducing the barrier to entry for real estate investment and enabling greater portfolio diversification with lower capital requirements."
  },
  {
    question: "Who are The Vendors here",
    answer: "Our vendors include property developers, real estate agencies, individual property owners, and investment firms who list their properties on our platform. All vendors undergo verification procedures to ensure the authenticity of their listings and compliance with legal requirements in their respective jurisdictions."
  }
];

const FAQ = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-propady-mint/20 z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AccordionItem value={`item-${index}`} className="border-none">
                  <AccordionTrigger className="bg-propady-mint *:text-black py-4 px-6 rounded-xl flex items-center justify-between hover:no-underline hover:bg-propady-mint-light">
                    <span>{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="p-6 mt-2 glass-morphism rounded-xl text-white animate-fade-in">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
