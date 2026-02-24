import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Globe, 
  Menu, 
  X, 
  LogOut, 
  ChevronDown,
  User,
  Lock,
  Mail,
  AlertCircle,
  Smartphone,
  Phone,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../utils';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { auth } from '../services/firebase';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'initial'>('initial');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
      setAuthMethod('initial');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setShowAuthModal(false);
      setAuthMethod('initial');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInAnonymously(auth);
      setShowAuthModal(false);
      setAuthMethod('initial');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      setShowCodeInput(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await confirmationResult.confirm(verificationCode);
      setShowAuthModal(false);
      setPhone('');
      setVerificationCode('');
      setShowCodeInput(false);
      setAuthMethod('initial');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-darker selection:bg-brand-primary/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-bg-darker shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform">
                <Zap size={20} fill="currentColor" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Converter Tudo</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className={cn("text-sm font-medium transition-colors", location.pathname === "/" ? "text-brand-primary" : "text-slate-400 hover:text-white")}>{t.nav.home}</Link>
              <Link to="/converters" className={cn("text-sm font-medium transition-colors", location.pathname === "/converters" ? "text-brand-primary" : "text-slate-400 hover:text-white")}>{t.nav.converters}</Link>
              <Link to="/about" className={cn("text-sm font-medium transition-colors", location.pathname === "/about" ? "text-brand-primary" : "text-slate-400 hover:text-white")}>{t.nav.about}</Link>
              <Link to="/contact" className={cn("text-sm font-medium transition-colors", location.pathname === "/contact" ? "text-brand-primary" : "text-slate-400 hover:text-white")}>{t.nav.contact}</Link>
              <Link to="/blog" className={cn("text-sm font-medium transition-colors", location.pathname === "/blog" ? "text-brand-primary" : "text-slate-400 hover:text-white")}>{t.nav.blog}</Link>
              
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
                <Link to="/" className="block text-lg font-medium text-slate-300">{t.nav.home}</Link>
                <Link to="/converters" className="block text-lg font-medium text-slate-300">{t.nav.converters}</Link>
                <Link to="/about" className="block text-lg font-medium text-slate-300">{t.nav.about}</Link>
                <Link to="/contact" className="block text-lg font-medium text-slate-300">{t.nav.contact}</Link>
                <Link to="/blog" className="block text-lg font-medium text-slate-300">{t.nav.blog}</Link>
                
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
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-bg-darker border-t border-white/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-24">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-8 group w-fit">
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-bg-darker group-hover:scale-110 transition-transform">
                  <Zap size={20} fill="currentColor" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">Converter Tudo</span>
              </Link>
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
            
            <div>
              <h4 className="font-bold text-white mb-8 uppercase text-xs tracking-[0.2em]">{t.footer.product}</h4>
              <ul className="space-y-5">
                <li><Link to="/converters" className="text-slate-500 hover:text-brand-primary transition-colors text-sm font-medium">{t.nav.converters}</Link></li>
                <li><Link to="/status" className="text-slate-500 hover:text-brand-primary transition-colors text-sm font-medium">{t.footer.status}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-8 uppercase text-xs tracking-[0.2em]">{t.footer.support}</h4>
              <ul className="space-y-5">
                <li><Link to="/contact" className="text-slate-500 hover:text-brand-primary transition-colors text-sm font-medium">{t.footer.contact}</Link></li>
                <li><Link to="/support" className="text-slate-500 hover:text-brand-primary transition-colors text-sm font-medium">{t.footer.supportProject}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-8 uppercase text-xs tracking-[0.2em]">{t.footer.company}</h4>
              <ul className="space-y-5">
                <li><Link to="/about" className="text-slate-500 hover:text-brand-primary transition-colors text-sm font-medium">{t.footer.about}</Link></li>
                <li><Link to="/blog" className="text-slate-500 hover:text-brand-primary transition-colors text-sm font-medium">{t.footer.blog}</Link></li>
                <li><Link to="/privacy" className="text-slate-500 hover:text-brand-primary transition-colors text-sm font-medium">{t.footer.privacy}</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-600 text-sm font-medium">
              © 2026 Converter Tudo. {t.footer.builtWith}
            </p>
            <div className="flex gap-10">
              <Link to="/terms" className="text-slate-600 hover:text-white text-sm font-medium transition-colors">{t.footer.terms}</Link>
              <Link to="/privacy" className="text-slate-600 hover:text-white text-sm font-medium transition-colors">{t.footer.privacy}</Link>
              <Link to="/cookies" className="text-slate-600 hover:text-white text-sm font-medium transition-colors">{t.footer.cookies}</Link>
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
              <div id="recaptcha-container"></div>
              
              <button 
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthMethod('initial');
                  setShowCodeInput(false);
                }}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {authMethod !== 'initial' && !showCodeInput && (
                <button 
                  onClick={() => setAuthMethod('initial')}
                  className="absolute top-6 left-6 p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              )}

              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {authMethod === 'phone' ? <Smartphone size={32} /> : <User size={32} />}
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  {showCodeInput ? t.auth.verificationCode : authMethod === 'phone' ? t.auth.phoneSignIn : authMode === 'login' ? t.auth.loginTitle : t.auth.signupTitle}
                </h2>
                <p className="text-slate-400">
                  {showCodeInput ? t.auth.signupDesc : authMethod === 'phone' ? t.auth.signupDesc : authMode === 'login' ? t.auth.loginDesc : t.auth.signupDesc}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
                  <AlertCircle size={18} />
                  <p className="break-words">{error}</p>
                </div>
              )}

              {authMethod === 'initial' ? (
                <div className="space-y-4">
                  <button 
                    onClick={() => setAuthMethod('email')}
                    className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all group"
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-bg-darker transition-all">
                      <Mail size={20} />
                    </div>
                    <span className="font-bold">{t.auth.email}</span>
                  </button>

                  <button 
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all group"
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-bg-darker transition-all">
                      <Globe size={20} />
                    </div>
                    <span className="font-bold">{t.auth.googleSignIn}</span>
                  </button>

                  <button 
                    onClick={() => setAuthMethod('phone')}
                    className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all group"
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-bg-darker transition-all">
                      <Smartphone size={20} />
                    </div>
                    <span className="font-bold">{t.auth.phoneSignIn}</span>
                  </button>

                  <button 
                    onClick={handleAnonymousSignIn}
                    className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all group"
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-bg-darker transition-all">
                      <User size={20} />
                    </div>
                    <span className="font-bold">{t.auth.anonymousSignIn}</span>
                  </button>
                </div>
              ) : authMethod === 'phone' ? (
                <form onSubmit={showCodeInput ? handleVerifyCode : handlePhoneSignIn} className="space-y-6">
                  {!showCodeInput ? (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-300 ml-1">{t.auth.phoneNumber}</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                          type="tel" 
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-brand-primary/50 transition-all"
                          placeholder="+1 234 567 890"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-300 ml-1">{t.auth.verificationCode}</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                          type="text" 
                          required
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-brand-primary/50 transition-all"
                          placeholder="123456"
                        />
                      </div>
                    </div>
                  )}
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && <div className="w-5 h-5 border-2 border-bg-darker border-t-transparent rounded-full animate-spin" />}
                    {showCodeInput ? t.auth.verifyCode : t.auth.sendCode}
                  </button>
                </form>
              ) : (
                <>
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
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading && <div className="w-5 h-5 border-2 border-bg-darker border-t-transparent rounded-full animate-spin" />}
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
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
