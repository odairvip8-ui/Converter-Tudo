import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ShieldCheck, 
  Globe, 
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
  FileText,
  Music,
  ArrowRightLeft,
  Smartphone,
  Book,
  Hash,
  FileImage,
  Cpu,
  Video,
  Download,
  Monitor,
  Smartphone as MobileIcon,
  User,
  Lock,
  Mail,
  ArrowRight
} from 'lucide-react';
import { FileDropzone, FileDropzoneHandle } from './components/FileDropzone';
import { CategoryCard } from './components/CategoryCard';
import { CATEGORIES, ALL_FORMATS } from './constants';
import { cn } from './utils';
import { useLanguage } from './LanguageContext';

function ToolItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <li className="flex items-center gap-3 group cursor-pointer">
      <div className="w-8 h-8 bg-white/5 text-brand-primary rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-bg-darker transition-all">
        {icon}
      </div>
      <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{label}</span>
    </li>
  );
}

export default function App() {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showAllConvertersModal, setShowAllConvertersModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropzoneRef = useRef<FileDropzoneHandle>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        const userData = data.user || { email };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setShowAuthModal(false);
        setEmail('');
        setPassword('');
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

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
    <div className="min-h-screen flex flex-col bg-bg-darker selection:bg-brand-primary/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-bg-darker shadow-lg shadow-brand-primary/20">
                <Zap size={20} fill="currentColor" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Converter Tudo</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#converters" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">{t.nav.converters}</a>
              <a href="#tools" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">{t.nav.tools}</a>
              
              {/* Language Selector */}
              <div className="relative">
                <button 
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  <Globe size={16} />
                  {language}
                  <ChevronDown size={14} className={cn("transition-transform", showLangDropdown && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {showLangDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-32 glass-dark rounded-xl border border-white/10 p-1 z-[60]"
                    >
                      {[
                        { code: 'EN', label: 'English' },
                        { code: 'PT', label: 'Português' },
                        { code: 'ES', label: 'Español' }
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code as any);
                            setShowLangDropdown(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                            language === lang.code ? "bg-brand-primary text-bg-darker" : "text-slate-400 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-4 w-px bg-white/10" />
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-400">{user.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-all border border-white/10"
                  >
                    <LogOut size={16} />
                    {t.nav.signOut}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                  className="px-6 py-2.5 bg-brand-primary text-bg-darker rounded-xl text-sm font-bold hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/10"
                >
                  {t.nav.signIn}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-bg-dark border-b border-white/5 overflow-hidden"
            >
              <div className="p-4 space-y-4">
                <a href="#converters" className="block text-lg font-medium text-slate-300">{t.nav.converters}</a>
                <a href="#tools" className="block text-lg font-medium text-slate-300">{t.nav.tools}</a>
                
                {/* Mobile Language Selector */}
                <div className="flex gap-4 pt-2">
                  {['EN', 'PT', 'ES'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang as any)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                        language === lang 
                          ? "bg-brand-primary text-bg-darker" 
                          : "bg-white/5 text-slate-400 border border-white/10"
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                {user ? (
                  <button 
                    onClick={handleLogout}
                    className="w-full py-3 bg-white/5 text-white rounded-xl font-semibold border border-white/10"
                  >
                    {t.nav.signOut} ({user.email})
                  </button>
                ) : (
                  <button 
                    onClick={() => { setAuthMode('login'); setShowAuthModal(true); setIsMenuOpen(false); }}
                    className="w-full py-3 bg-brand-primary text-bg-darker rounded-xl font-bold"
                  >
                    {t.nav.signIn}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">
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

        {/* Quick Tools Grid */}
        <section id="tools" className="py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-16 text-center">{t.tools.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
               <div>
                  <h3 className="text-brand-primary font-bold mb-8 flex items-center gap-2">
                    <FileText size={18} />
                    {t.tools.document}
                  </h3>
                  <ul className="space-y-5">
                    <ToolItem icon={<FileText size={16}/>} label="PDF to Word" />
                    <ToolItem icon={<FileText size={16}/>} label="Word to PDF" />
                    <ToolItem icon={<FileText size={16}/>} label="Excel to PDF" />
                    <ToolItem icon={<Book size={16}/>} label="EPUB to PDF" />
                    <ToolItem icon={<Smartphone size={16}/>} label="MOBI to EPUB" />
                  </ul>
               </div>
               <div>
                  <h3 className="text-brand-primary font-bold mb-8 flex items-center gap-2">
                    <FileImage size={18} />
                    {t.tools.image}
                  </h3>
                  <ul className="space-y-5">
                    <ToolItem icon={<FileImage size={16}/>} label="JPG to PNG" />
                    <ToolItem icon={<FileImage size={16}/>} label="PNG to WebP" />
                    <ToolItem icon={<FileImage size={16}/>} label="SVG to PNG" />
                    <ToolItem icon={<FileImage size={16}/>} label="HEIC to JPG" />
                    <ToolItem icon={<Hash size={16}/>} label={t.tools.imageOptimizer} />
                  </ul>
               </div>
               <div>
                  <h3 className="text-brand-primary font-bold mb-8 flex items-center gap-2">
                    <Video size={18} />
                    {t.tools.video}
                  </h3>
                  <ul className="space-y-5">
                    <ToolItem icon={<Video size={16}/>} label="MP4 to MP3" />
                    <ToolItem icon={<Music size={16}/>} label="WAV to MP3" />
                    <ToolItem icon={<Video size={16}/>} label="MOV to MP4" />
                    <ToolItem icon={<Video size={16}/>} label={t.tools.videoCompressor} />
                    <ToolItem icon={<ArrowRightLeft size={16}/>} label={t.tools.audioTrimmer} />
                  </ul>
               </div>
               <div>
                  <h3 className="text-brand-primary font-bold mb-8 flex items-center gap-2">
                    <Cpu size={18} />
                    {t.tools.dev}
                  </h3>
                  <ul className="space-y-5">
                    <ToolItem icon={<Cpu size={16}/>} label="JSON to CSV" />
                    <ToolItem icon={<Cpu size={16}/>} label="XML to JSON" />
                    <ToolItem icon={<Hash size={16}/>} label={t.tools.base64Encoder} />
                    <ToolItem icon={<Hash size={16}/>} label={t.tools.md5Generator} />
                    <ToolItem icon={<Globe size={16}/>} label={t.tools.urlDecoder} />
                  </ul>
               </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-[3.5rem] bg-brand-primary p-12 md:p-24 overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#000_1px,transparent_1px)] [background-size:40px_40px]" />
              </div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black text-bg-darker mb-8 leading-tight">
                  {t.cta.title}
                </h2>
                <p className="text-bg-darker/70 text-lg md:text-xl font-medium mb-12">
                  {t.cta.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button 
                    onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                    className="w-full sm:w-auto px-10 py-5 bg-bg-darker text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl"
                  >
                    {t.cta.createAccount}
                  </button>
                  <button className="w-full sm:w-auto px-10 py-5 bg-white/20 text-bg-darker rounded-2xl font-bold hover:bg-white/30 transition-all border border-bg-darker/10">
                    {t.cta.enterprise}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-bg-darker border-t border-white/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-24">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-bg-darker">
                  <Zap size={20} fill="currentColor" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">Converter Tudo</span>
              </div>
              <p className="text-slate-500 max-w-xs mb-10 text-lg">
                {t.footer.desc}
              </p>
              <div className="flex gap-5">
                {['Twitter', 'Github', 'Discord'].map(social => (
                  <a key={social} href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-brand-primary hover:bg-white/10 transition-all border border-white/5">
                    <Globe size={20} />
                  </a>
                ))}
              </div>
            </div>
            
            {[
              { title: t.footer.product, links: ['Converters', 'API', 'Pricing', 'Enterprise'] },
              { title: t.footer.support, links: ['Help Center', 'Status', 'Contact', 'Privacy'] },
              { title: t.footer.company, links: ['About', 'Blog', 'Careers', 'Legal'] }
            ].map((group, i) => (
              <div key={i}>
                <h4 className="font-bold text-white mb-8 uppercase text-xs tracking-[0.2em]">{group.title}</h4>
                <ul className="space-y-5">
                  {group.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-slate-500 hover:text-brand-primary transition-colors text-sm font-medium">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-600 text-sm font-medium">
              © 2026 Converter Tudo. {t.footer.builtWith}
            </p>
            <div className="flex gap-10">
              {[t.footer.terms, t.footer.privacy, t.footer.cookies].map(item => (
                <a key={item} href="#" className="text-slate-600 hover:text-white text-sm font-medium transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-bg-darker/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass-dark rounded-[2.5rem] p-8 md:p-12 border border-white/10"
            >
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <User size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  {authMode === 'login' ? t.auth.loginTitle : t.auth.signupTitle}
                </h2>
                <p className="text-slate-400">
                  {authMode === 'login' ? t.auth.loginDesc : t.auth.signupDesc}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 ml-1">{t.auth.email}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-brand-primary/50 transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 ml-1">{t.auth.password}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-brand-primary/50 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full btn-primary py-4 text-lg">
                  {authMode === 'login' ? t.auth.signInBtn : t.auth.signUpBtn}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="text-slate-400 hover:text-brand-primary transition-colors font-medium"
                >
                  {authMode === 'login' ? t.auth.noAccount : t.auth.hasAccount}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                <motion.div 
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {CATEGORIES.map((cat) => {
                    const filteredFormats = cat.formats.filter(f => 
                      f.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    if (searchQuery && filteredFormats.length === 0) return null;

                    return (
                      <motion.div 
                        key={cat.id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          show: { opacity: 1, y: 0 }
                        }}
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
                      </motion.div>
                    );
                  })}
                </motion.div>
                
                {searchQuery && CATEGORIES.every(cat => 
                  !cat.formats.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) &&
                  !cat.name.toLowerCase().includes(searchQuery.toLowerCase())
                ) && (
                  <div className="text-center py-20">
                    <p className="text-slate-500 text-lg">{t.allConverters.noResults}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
