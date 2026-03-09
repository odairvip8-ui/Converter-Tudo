import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Type, PenTool } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (signature: { text: string; font: string }) => void;
}

const SIGNATURE_FONTS = [
  { id: 'font-signature-1', name: 'Dancing Script', class: 'font-[Dancing_Script]' },
  { id: 'font-signature-2', name: 'Pacifico', class: 'font-[Pacifico]' },
  { id: 'font-signature-3', name: 'Caveat', class: 'font-[Caveat]' },
  { id: 'font-signature-4', name: 'Satisfy', class: 'font-[Satisfy]' },
];

export const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [text, setText] = useState('');
  const [selectedFont, setSelectedFont] = useState(SIGNATURE_FONTS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-bg-darker/90 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md glass-dark rounded-[2.5rem] p-8 border border-white/10"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-8">
          <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-4">
            <PenTool size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Criar Assinatura</h2>
          <p className="text-slate-400 text-sm">Escreva o seu nome para gerar a assinatura digital.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">O seu nome</label>
            <input 
              type="text" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-primary/50 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Escolha o estilo</label>
            <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {SIGNATURE_FONTS.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setSelectedFont(font)}
                  className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                    selectedFont.id === font.id 
                      ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' 
                      : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <span className={`text-xl ${font.class}`}>
                    {text || 'Assinatura'}
                  </span>
                  {selectedFont.id === font.id && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              if (text.trim()) {
                onConfirm({ text, font: selectedFont.name });
                onClose();
              }
            }}
            disabled={!text.trim()}
            className="w-full btn-primary py-4 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
          >
            Confirmar Assinatura
          </button>
        </div>
      </motion.div>
    </div>
  );
};
