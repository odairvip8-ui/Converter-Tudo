import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-6xl font-black text-white mb-8">{t.pages.contact.title}</h1>
        <p className="text-xl text-slate-400 mb-16">{t.pages.contact.subtitle}</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl glass border-white/5 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Address</h4>
                <p className="text-slate-400 whitespace-pre-line">{t.pages.contact.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Email</h4>
                <a href={`mailto:${t.pages.contact.email}`} className="text-brand-primary hover:underline">{t.pages.contact.email}</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Phone</h4>
                <p className="text-slate-400">{t.pages.contact.phone}</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center text-center">
            <p className="text-slate-300 text-lg italic">
              {t.pages.contact.footer}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
