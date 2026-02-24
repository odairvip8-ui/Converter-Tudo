import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ShieldCheck, 
  Globe, 
  Download,
  Monitor,
  Smartphone as MobileIcon,
  X,
  ArrowRight,
  Search
} from 'lucide-react';
import { FileDropzone, FileDropzoneHandle } from '../components/FileDropzone';
import { CategoryCard } from '../components/CategoryCard';
import { CATEGORIES } from '../constants';
import { cn } from '../utils';
import { useLanguage } from '../LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showAllConvertersModal, setShowAllConvertersModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropzoneRef = useRef<FileDropzoneHandle>(null);

  const handleDownload = (type: 'pc' | 'apk') => {
    const filename = type === 'pc' ? 'ConverterTudo-Setup.exe' : 'ConverterTudo.apk';
    const blob = new Blob(['Mock binary content for ' + filename], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const triggerUpload = () => {
    dropzoneRef.current?.open();
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 blur-[120px] rounded-full -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -ml-64 -mb-64" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-widest mb-8 border border-brand-primary/20">
                <Zap size={14} />
                {t.hero.badge}
              </span>
              <h1 
                onClick={triggerUpload}
                className="text-5xl md:text-8xl font-extrabold tracking-tight text-white mb-8 leading-[1.1] cursor-pointer hover:opacity-90 transition-opacity"
              >
                {t.hero.title} <br />
                <span className="gradient-text">{t.hero.titleAccent}</span>
              </h1>
              <p 
                onClick={triggerUpload}
                className="text-lg md:text-xl text-slate-400 leading-relaxed mb-12 max-w-2xl mx-auto cursor-pointer hover:text-slate-300 transition-colors"
              >
                {t.hero.subtitle}
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                <button 
                  onClick={() => setShowDownloadModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Download size={20} />
                  {t.hero.downloadBtn}
                </button>
                <button 
                  onClick={triggerUpload}
                  className="btn-secondary"
                >
                  {t.hero.exploreBtn}
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative z-10"
          >
            <div className="glass-dark rounded-[2.5rem] p-4 md:p-8">
              <FileDropzone 
                onFilesSelected={(files) => console.log('Files:', files)} 
                selectedCategoryId={selectedCategoryId}
                ref={dropzoneRef}
              />
            </div>
          </motion.div>

          {/* Trust Badges */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: <ShieldCheck size={24} />, title: t.trust.secure.title, desc: t.trust.secure.desc },
              { icon: <Globe size={24} />, title: t.trust.cloud.title, desc: t.trust.cloud.desc },
              { icon: <Zap size={24} />, title: t.trust.instant.title, desc: t.trust.instant.desc }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 p-8 rounded-3xl glass border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{item.title}</h4>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Home Page Content */}
          <div className="mt-32 max-w-4xl mx-auto text-center">
            <Link to="/">
              <h2 className="text-3xl font-bold text-white mb-8 hover:text-brand-primary transition-colors">{t.pages.home.title}</h2>
            </Link>
            <p className="text-slate-400 text-lg leading-relaxed mb-12">
              {t.pages.home.description}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {t.pages.home.categories.map((cat: string) => (
                <div key={cat} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-medium">
                  {cat}
                </div>
              ))}
            </div>
            
            <p className="text-slate-500 italic">
              {t.pages.home.footer}
            </p>
          </div>
        </div>
      </section>

      {/* Converters Section */}
      <section id="converters" className="py-32 bg-bg-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold text-white mb-6">{t.converters.title}</h2>
              <p className="text-slate-400 text-lg">
                {t.converters.subtitle}
              </p>
            </div>
            <button 
              onClick={() => setShowAllConvertersModal(true)}
              className="inline-flex items-center gap-2 text-brand-primary font-bold hover:gap-4 transition-all group"
            >
              {t.converters.viewAll}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bento-grid">
            {CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryCard 
                  category={category} 
                  isActive={selectedCategoryId === category.id}
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setTimeout(triggerUpload, 500);
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Modal */}
      <AnimatePresence>
        {showDownloadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDownloadModal(false)}
              className="absolute inset-0 bg-bg-darker/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass-dark rounded-[2.5rem] p-8 md:p-12 border border-white/10"
            >
              <button 
                onClick={() => setShowDownloadModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">{t.download.title}</h2>
                <p className="text-slate-400 text-lg">{t.download.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-primary/30 transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Monitor size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t.download.desktopTitle}</h3>
                  <p className="text-slate-400 mb-8">{t.download.desktopDesc}</p>
                  <button 
                    onClick={() => handleDownload('pc')}
                    className="w-full btn-primary"
                  >
                    {t.download.desktopBtn}
                  </button>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-primary/30 transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <MobileIcon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t.download.mobileTitle}</h3>
                  <p className="text-slate-400 mb-8">{t.download.mobileDesc}</p>
                  <button 
                    onClick={() => handleDownload('apk')}
                    className="w-full btn-secondary"
                  >
                    {t.download.mobileBtn}
                  </button>
                </div>
              </div>

              <div className="mt-10 p-6 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 text-center">
                <p className="text-brand-primary text-sm font-bold uppercase tracking-widest">{t.download.proTip}</p>
                <p className="text-slate-300 mt-2">{t.download.proTipDesc}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* All Converters Modal */}
      <AnimatePresence>
        {showAllConvertersModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllConvertersModal(false)}
              className="absolute inset-0 bg-bg-darker/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl glass-dark rounded-[2.5rem] p-8 md:p-12 border border-white/10 max-h-[90vh] overflow-hidden flex flex-col"
            >
              <button 
                onClick={() => setShowAllConvertersModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">{t.allConverters.title}</h2>
                <p className="text-slate-400 text-lg mb-8">{t.allConverters.subtitle}</p>
                
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input 
                    type="text"
                    placeholder={t.allConverters.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-brand-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex-grow overflow-y-auto pr-4 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {CATEGORIES.map((cat) => {
                    const filteredFormats = cat.formats.filter(f => 
                      f.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    if (searchQuery && filteredFormats.length === 0) return null;

                    return (
                      <div 
                        key={cat.id}
                        className="p-6 rounded-3xl bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", cat.bgColor, cat.color)}>
                            <cat.icon size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{(t.categories as any)[cat.id]?.name || cat.name}</h3>
                            <p className="text-sm text-slate-500">{t.allConverters.category}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {(searchQuery ? filteredFormats : cat.formats).map(format => (
                            <span 
                              key={format}
                              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:border-brand-primary/50 hover:text-brand-primary transition-all cursor-default"
                            >
                              {format}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
