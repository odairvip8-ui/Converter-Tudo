import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';

export default function Privacy() {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose prose-invert max-w-none"
      >
        <h1 className="text-4xl md:text-6xl font-black text-white mb-8">{t.pages.privacy.title}</h1>
        <p className="text-xl text-slate-400 mb-12">{t.pages.privacy.intro}</p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">{t.pages.privacy.dataCollected.title}</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.pages.privacy.dataCollected.items.map((item: string, i: number) => (
              <li key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">{t.pages.privacy.purpose.title}</h2>
          <p className="text-slate-400 mb-4">{t.pages.privacy.purpose.content}</p>
          <ul className="space-y-2">
            {t.pages.privacy.purpose.items.map((item: string, i: number) => (
              <li key={i} className="text-slate-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">{t.pages.privacy.advertising.title}</h2>
          <p className="text-slate-400 leading-relaxed">{t.pages.privacy.advertising.content}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">{t.pages.privacy.rights.title}</h2>
          <p className="text-slate-400 mb-4">{t.pages.privacy.rights.content}</p>
          <div className="flex flex-wrap gap-3 mb-8">
            {t.pages.privacy.rights.items.map((item: string, i: number) => (
              <span key={i} className="px-4 py-2 rounded-xl bg-brand-primary/10 text-brand-primary font-bold text-sm">
                {item}
              </span>
            ))}
          </div>
          <p className="text-slate-500 italic">{t.pages.privacy.rights.contact}</p>
        </section>
      </motion.div>
    </div>
  );
}
