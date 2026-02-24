import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';

export default function Cookies() {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-6xl font-black text-white mb-8">{t.pages.cookies.title}</h1>
        <p className="text-xl text-slate-400 mb-8">{t.pages.cookies.content}</p>

        <ul className="space-y-4 mb-12">
          {t.pages.cookies.items.map((item: string, i: number) => (
            <li key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-lg">
              {item}
            </li>
          ))}
        </ul>

        <p className="text-slate-500 italic text-center">
          {t.pages.cookies.footer}
        </p>
      </motion.div>
    </div>
  );
}
