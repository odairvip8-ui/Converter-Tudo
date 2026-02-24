import React from 'react';
import { motion } from 'motion/react';
import { Heart, ExternalLink } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Support() {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-24 h-24 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-12">
          <Heart size={48} fill="currentColor" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-white mb-12">
          {t.pages.support.title}
        </h1>

        {/* Advanced Support Section */}
        <div className="relative group">
          {/* Decorative background glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-bg-dark border border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-2xl overflow-hidden">
            {/* Subtle light gradient overlay to match user's request for "gradiente leve" but in dark mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">
              Apoie o Projeto / Support the Project
            </h2>

            <div className="space-y-8 mb-12 text-left md:text-center">
              <div className="space-y-3">
                <p className="text-brand-primary font-black uppercase tracking-widest text-xs">Português</p>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Converter Tudo é uma plataforma gratuita que ajuda milhares de pessoas a realizar conversões de unidades de forma rápida e precisa.<br className="hidden md:block" />
                  Todo apoio é voluntário e nos ajuda a manter os servidores ativos, melhorar funcionalidades e garantir que a plataforma continue gratuita.
                </p>
              </div>

              <div className="w-12 h-px bg-white/10 mx-auto" />

              <div className="space-y-3">
                <p className="text-brand-primary font-black uppercase tracking-widest text-xs">English</p>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Converter Tudo is a free platform that helps thousands of people perform unit conversions quickly and accurately.<br className="hidden md:block" />
                  Every contribution helps us keep the servers running, improve features, and ensure the platform remains free.
                </p>
              </div>
            </div>

            {/* Donation Button */}
            <motion.a 
              href="https://www.paypal.com/donate?business=kutzoliver0%40gmail.com" 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-4 bg-[#003087] hover:bg-[#001f5b] text-white font-bold py-5 px-10 rounded-2xl transition-all shadow-xl shadow-blue-900/20 group/btn"
            >
              <img 
                src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" 
                alt="PayPal"
                className="w-8 h-auto rounded-md"
              />
              <span className="text-lg">Faça uma Doação / Donate Now</span>
              <ExternalLink size={18} className="opacity-50 group-hover/btn:opacity-100 transition-opacity" />
            </motion.a>

            {/* Alternative Info */}
            <div className="mt-12 pt-8 border-t border-white/5">
              <p className="text-slate-500 text-sm">
                Ou use o telefone associado ao PayPal: <strong className="text-slate-300 font-bold">+351 967 859 472</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <p className="text-slate-500 text-lg italic">
            {t.pages.support.footer}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
