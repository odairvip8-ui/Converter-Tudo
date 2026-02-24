import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';

export default function About() {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-6xl font-black text-white mb-12">{t.pages.about.title}</h1>
        <div className="space-y-8">
          {t.pages.about.content.map((p: string, i: number) => (
            <p key={i} className="text-xl text-slate-400 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
