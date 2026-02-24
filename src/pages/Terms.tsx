import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';

export default function Terms() {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-6xl font-black text-white mb-8">{t.pages.terms.title}</h1>
        <p className="text-xl text-slate-400 mb-8">{t.pages.terms.intro}</p>

        <ul className="space-y-4 mb-16">
          {t.pages.terms.items.map((item: string, i: number) => (
            <li key={i} className="flex items-center gap-4 text-slate-300 text-lg">
              <div className="w-2 h-2 rounded-full bg-brand-primary shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <section className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">{t.pages.terms.limitation.title}</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            {t.pages.terms.limitation.content}
          </p>
          <p className="text-slate-500 italic">
            {t.pages.terms.limitation.footer}
          </p>
        </section>
      </motion.div>
    </div>
  );
}
