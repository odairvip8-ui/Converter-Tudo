import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram, 
  Share2,
  MessageCircle,
  Send,
  Link as LinkIcon
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface BlogItem {
  title: string;
  intro: string;
  content: string;
  conclusion: string;
}

export default function Blog() {
  const { t } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleShare = (platform: string, item: BlogItem) => {
    const url = window.location.href;
    const text = `${item.title} - Converter Tudo Blog`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        break;
      case 'instagram':
        window.open(`https://www.instagram.com/`, '_blank');
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-6 mb-12">
          <Link to="/" className="flex items-center gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen size={32} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white group-hover:text-brand-primary transition-colors">{t.pages.blog.title}</h1>
          </Link>
        </div>

        <p className="text-2xl text-slate-400 mb-16">{t.pages.blog.intro}</p>

        <div className="grid gap-6 mb-16">
          {t.pages.blog.items.map((item: BlogItem, i: number) => (
            <div 
              key={i} 
              className={`group rounded-3xl glass border-white/5 transition-all overflow-hidden ${expandedIndex === i ? 'border-brand-primary/40 shadow-2xl shadow-brand-primary/10' : 'hover:border-brand-primary/20'}`}
            >
              <div className="p-8">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                    className="text-left flex-1"
                  >
                    <h3 className={`text-xl font-bold transition-colors ${expandedIndex === i ? 'text-brand-primary' : 'text-white group-hover:text-brand-primary'}`}>
                      {item.title}
                    </h3>
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 mr-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                      <button onClick={() => handleShare('instagram', item)} className="p-1.5 text-slate-400 hover:text-pink-500 transition-colors" title="Instagram"><Instagram size={16} /></button>
                      <button onClick={() => handleShare('twitter', item)} className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors" title="Twitter"><Twitter size={16} /></button>
                      <button onClick={() => handleShare('facebook', item)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors" title="Facebook"><Facebook size={16} /></button>
                      <button onClick={() => handleShare('linkedin', item)} className="p-1.5 text-slate-400 hover:text-blue-700 transition-colors" title="LinkedIn"><Linkedin size={16} /></button>
                      <button onClick={() => handleShare('whatsapp', item)} className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors" title="WhatsApp"><MessageCircle size={16} /></button>
                      <button onClick={() => handleShare('telegram', item)} className="p-1.5 text-slate-400 hover:text-sky-500 transition-colors" title="Telegram"><Send size={16} /></button>
                      <button onClick={() => handleShare('copy', item)} className="p-1.5 text-slate-400 hover:text-white transition-colors" title="Copy Link"><LinkIcon size={16} /></button>
                    </div>
                    <button
                      onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                      className={`p-2 rounded-xl bg-white/5 text-slate-400 transition-all ${expandedIndex === i ? 'rotate-180 bg-brand-primary/20 text-brand-primary' : ''}`}
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm line-clamp-2">
                  {item.intro}
                </p>
              </div>

              <AnimatePresence>
                {expandedIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-8 pb-8 space-y-6">
                      <div className="h-px w-full bg-white/5" />
                      
                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-brand-primary uppercase tracking-widest">Introdução</h4>
                        <p className="text-slate-300 leading-relaxed">{item.intro}</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-brand-primary uppercase tracking-widest">Explicação e Exemplos</h4>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-slate-300 font-mono text-sm whitespace-pre-line leading-loose">
                          {item.content}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-brand-primary uppercase tracking-widest">Conclusão</h4>
                        <p className="text-slate-300 leading-relaxed italic">{item.conclusion}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="p-8 rounded-3xl bg-brand-primary/5 border border-brand-primary/10 text-center">
          <p className="text-slate-400 text-lg italic">
            {t.pages.blog.footer}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
