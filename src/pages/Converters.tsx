import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';

export default function Converters() {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-6xl font-black text-white mb-8">{t.pages.converters.title}</h1>
        <p className="text-xl text-slate-400 leading-relaxed mb-16">
          {t.pages.converters.description}
        </p>

        <div className="grid gap-8">
          {t.pages.converters.items.map((item: any, i: number) => (
            <div key={i} className="p-8 rounded-3xl glass border-white/5">
              <h3 className="text-2xl font-bold text-brand-primary mb-4">{item.title}</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-slate-500 italic text-center">
          {t.pages.converters.footer}
        </p>
      </motion.div>
    </div>
  );
}
