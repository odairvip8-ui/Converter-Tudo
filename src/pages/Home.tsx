import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap,
  ShieldCheck, 
  Globe, 
  X,
  ArrowRight,
  Search,
  Cloud,
  Layers,
  Cpu,
  Lock,
  Workflow,
  History,
  Code,
  Smartphone,
  FileText,
  Combine,
  Scissors,
  Minimize2,
  PenTool,
  FileEdit,
  Camera,
  Image as ImageIcon,
  Plus
} from 'lucide-react';
import { LogoIcon } from '../components/LogoIcon';
import { FileDropzone, FileDropzoneHandle } from '../components/FileDropzone';
import { CameraScanner } from '../components/CameraScanner';
import { CategoryCard } from '../components/CategoryCard';
import { CATEGORIES } from '../constants';
import { cn } from '../utils';
import { useLanguage } from '../LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showAllConvertersModal, setShowAllConvertersModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState<{title: string, desc: string, type?: string} | null>(null);
  const [activeTool, setActiveTool] = useState<{title: string, mode: 'merge' | 'split' | 'compress' | 'sign' | 'edit' | 'default', category: string} | null>(null);
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentFiles, setRecentFiles] = useState<{name: string, date: string}[]>([]);
  const dropzoneRef = useRef<FileDropzoneHandle>(null);

  useEffect(() => {
    const saved = localStorage.getItem('converter_history');
    if (saved) setRecentFiles(JSON.parse(saved));
  }, []);

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
                <LogoIcon size={14} />
                {t.hero.badge}
              </span>
              <h1 
                className="text-6xl md:text-9xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]"
              >
                Convert <span className="gradient-text">everything</span>
              </h1>
              
              {/* Search Bar - Inspired by the "white box" in screenshot */}
              <div className="max-w-2xl mx-auto mb-12 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 to-blue-500/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-white/5 border border-white/10 rounded-[2rem] p-2 backdrop-blur-xl">
                  <Search className="ml-6 text-slate-500" size={24} />
                  <input 
                    type="text"
                    placeholder="O que deseja converter hoje?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-white text-lg placeholder:text-slate-500"
                  />
                  <button 
                    onClick={() => setShowAllConvertersModal(true)}
                    className="btn-primary px-8 rounded-[1.5rem]"
                  >
                    Procurar
                  </button>
                </div>
              </div>

              <p 
                className="text-lg md:text-xl text-slate-400 leading-relaxed mb-12 max-w-2xl mx-auto"
              >
                Converter Tudo is a free online platform that allows you to convert units quickly, simply and accurately.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                {/* Explore Tools removed as requested */}
              </div>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          >
            {[
              { 
                icon: <Combine className="text-emerald-400" />, 
                title: "Juntar PDF", 
                desc: "Mesclar e juntar PDFs e colocá-los em qualquer ordem que desejar. É tudo muito fácil e rápido!",
                action: () => setActiveTool({ title: "Juntar PDF", mode: 'merge', category: 'document' })
              },
              { 
                icon: <Scissors className="text-blue-400" />, 
                title: "Dividir PDF", 
                desc: "Selecione um intervalo de páginas, separe uma página, ou converta cada página do arquivo em PDF independente.",
                action: () => setActiveTool({ title: "Dividir PDF", mode: 'split', category: 'document' })
              },
              { 
                icon: <Minimize2 className="text-purple-400" />, 
                title: "Comprimir PDF", 
                desc: "Diminua o tamanho do seu arquivo PDF, mantendo a melhor qualidade possível. Otimize seus arquivos PDF.",
                action: () => setActiveTool({ title: "Comprimir PDF", mode: 'compress', category: 'document' })
              },
              { 
                icon: <PenTool className="text-rose-400" />, 
                title: "Assinar PDF", 
                desc: "Assine você mesmo ou solicite assinaturas eletrônicas de outros com segurança.",
                action: () => setActiveTool({ title: "Assinar PDF", mode: 'sign', category: 'document' })
              },
              { 
                icon: <FileEdit className="text-amber-400" />, 
                title: "Editar PDF", 
                desc: "Adicione texto, imagens, formas ou anotações livres a um documento PDF. Edite dimensão, fonte e cor.",
                action: () => setActiveTool({ title: "Editar PDF", mode: 'edit', category: 'document' })
              },
              { 
                icon: <ImageIcon className="text-indigo-400" />, 
                title: "Comprimir Foto", 
                desc: "Reduza o tamanho das suas imagens sem perder qualidade visível usando algoritmos de compressão inteligente.",
                action: () => setActiveTool({ title: "Comprimir Foto", mode: 'compress', category: 'image' })
              },
              { 
                icon: <Camera className="text-cyan-400" />, 
                title: "Digitalizar para PDF", 
                desc: "Capture digitalizações a partir do seu dispositivo móvel e converta-as instantaneamente em PDF.",
                action: () => setShowCameraScanner(true)
              },
              { 
                icon: <History className="text-lime-400" />, 
                title: "Histórico", 
                desc: "Aceda rapidamente às suas conversões recentes e recupere ficheiros processados.",
                action: () => setShowFeatureModal({ 
                  title: "Histórico de Ficheiros", 
                  type: 'history',
                  desc: recentFiles.length > 0 
                    ? "Aqui estão os seus ficheiros processados recentemente." 
                    : "Ainda não converteu nenhum ficheiro nesta sessão." 
                })
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                onClick={feature.action}
                className="glass-dark p-8 rounded-[2rem] border border-white/5 hover:border-brand-primary/30 transition-all group cursor-pointer hover:bg-white/[0.02]"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
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

          {/* Separate Dropzones Section */}
          <div className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Conversores Rápidos</h2>
              <p className="text-slate-400">Arraste os seus ficheiros diretamente para a categoria desejada.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { id: 'image', label: 'Imagens', color: 'text-emerald-400' },
                { id: 'audio', label: 'Áudio', color: 'text-blue-400' },
                { id: 'video', label: 'Vídeo', color: 'text-rose-400' },
                { id: 'document', label: 'Documentos', color: 'text-amber-400' }
              ].map((cat) => (
                <div key={cat.id} className="space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <h3 className={cn("text-xl font-bold flex items-center gap-2", cat.color)}>
                      <div className="w-2 h-2 rounded-full bg-current" />
                      {cat.label}
                    </h3>
                  </div>
                  <div className="glass-dark rounded-[2rem] p-4 border border-white/5 hover:border-white/10 transition-all">
                    <FileDropzone 
                      onFilesSelected={() => {}} 
                      selectedCategoryId={cat.id}
                      compact
                    />
                  </div>
                </div>
              ))}
            </div>
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

      {/* Floating Action Button for Scan */}
      <div className="fixed bottom-8 right-8 z-40">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowCameraScanner(true)}
          className="w-16 h-16 bg-brand-primary text-bg-darker rounded-full flex items-center justify-center shadow-2xl shadow-brand-primary/40 group relative"
        >
          <Camera size={28} />
          <div className="absolute right-full mr-4 px-4 py-2 bg-white text-bg-darker rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Digitalizar Documento
          </div>
        </motion.button>
      </div>

      {/* Active Tool Modal */}
      <AnimatePresence>
        {activeTool && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTool(null)}
              className="absolute inset-0 bg-bg-darker/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl glass-dark rounded-[2.5rem] p-8 md:p-12 border border-white/10 flex flex-col max-h-[90vh] overflow-hidden"
            >
              <button 
                onClick={() => setActiveTool(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">{activeTool.title}</h2>
                <p className="text-slate-400">Arraste os seus ficheiros para começar a {activeTool.title.toLowerCase()}.</p>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <FileDropzone 
                  onFilesSelected={() => {}} 
                  selectedCategoryId={activeTool.category}
                  mode={activeTool.mode}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Camera Scanner Modal */}
      <CameraScanner 
        isOpen={showCameraScanner} 
        onClose={() => setShowCameraScanner(false)}
        onSave={(blob, name) => {
          // Save to history when a scan is completed
          const historyItem = { name, date: new Date().toLocaleString() };
          const existingHistory = JSON.parse(localStorage.getItem('converter_history') || '[]');
          const newHistory = [historyItem, ...existingHistory].slice(0, 20);
          localStorage.setItem('converter_history', JSON.stringify(newHistory));
          setRecentFiles(newHistory);

          // Trigger download
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = name;
          link.click();
          URL.revokeObjectURL(url);
        }}
      />

      {/* Feature Modal */}
      <AnimatePresence>
        {showFeatureModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFeatureModal(null)}
              className="absolute inset-0 bg-bg-darker/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-dark rounded-[2.5rem] p-8 md:p-12 border border-white/10 text-center"
            >
              <button 
                onClick={() => setShowFeatureModal(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-20 h-20 bg-brand-primary/10 text-brand-primary rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Zap size={40} />
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">{showFeatureModal.title}</h2>
              
              {showFeatureModal.type === 'history' ? (
                <div className="space-y-3 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {recentFiles.length > 0 ? recentFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <History size={18} className="text-indigo-400" />
                        <span className="text-sm font-medium text-white">{file.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{file.date}</span>
                    </div>
                  )) : (
                    <p className="text-slate-500 py-8 italic">{showFeatureModal.desc}</p>
                  )}
                </div>
              ) : (
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  {showFeatureModal.desc}
                </p>
              )}

              <button 
                onClick={() => setShowFeatureModal(null)}
                className="btn-primary w-full"
              >
                {showFeatureModal.type === 'history' ? "Fechar" : "Entendido"}
              </button>
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
