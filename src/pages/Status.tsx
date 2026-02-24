import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Status() {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 size={48} />
          </div>
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-2">{t.pages.status.title}</h1>
            <p className="text-emerald-500 font-bold text-xl">{t.pages.status.intro}</p>
          </div>
        </div>

        <div className="grid gap-6 mb-16">
          {t.pages.status.items.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-8 rounded-3xl glass border-white/5">
              <span className="text-xl font-bold text-white">{item.label}</span>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-500 font-bold">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-slate-500 text-center italic">
          {t.pages.status.footer}
        </p>
      </motion.div>
    </div>
  );
}
