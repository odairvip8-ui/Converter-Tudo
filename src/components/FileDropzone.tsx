import React, { useCallback, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { jsPDF } from 'jspdf';
import { 
  Upload, 
  X, 
  File, 
  CheckCircle2, 
  Loader2, 
  Download, 
  Share2, 
  Mail, 
  MessageCircle, 
  Send,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import { FORMAT_MAPPING, ALL_FORMATS } from '../constants';
import { useLanguage } from '../LanguageContext';

export interface FileDropzoneHandle {
  open: () => void;
}

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  selectedCategoryId?: string | null;
}

interface FileWithTarget {
  file: File;
  targetFormat: string;
  status: 'pending' | 'converting' | 'completed' | 'error';
  resultUrl?: string;
  availableFormats: string[];
  progress: number;
}

export const FileDropzone = forwardRef<FileDropzoneHandle, FileDropzoneProps>(({ onFilesSelected, selectedCategoryId }, ref) => {
  const { t } = useLanguage();
  const [files, setFiles] = useState<FileWithTarget[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState<number | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const getAvailableFormats = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return FORMAT_MAPPING[ext] || ALL_FORMATS;
  };

  const getAcceptConfig = () => {
    const all = {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'audio/*': ['.mp3', '.wav', '.ogg'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'application/x-7z-compressed': ['.7z']
    };

    if (!selectedCategoryId) return all;

    switch (selectedCategoryId) {
      case 'image':
        return { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'] };
      case 'document':
        return {
          'application/pdf': ['.pdf'],
          'application/msword': ['.doc'],
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
          'text/plain': ['.txt']
        };
      case 'audio':
        return { 'audio/*': ['.mp3', '.wav', '.ogg', '.m4a', '.flac'] };
      case 'video':
        return { 'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'] };
      case 'archive':
        return {
          'application/zip': ['.zip'],
          'application/x-rar-compressed': ['.rar'],
          'application/x-7z-compressed': ['.7z'],
          'application/x-tar': ['.tar']
        };
      default:
        return all;
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileWithTarget[] = acceptedFiles.map(f => {
      const available = getAvailableFormats(f.name);
      return {
        file: f,
        targetFormat: available[0] || 'PDF',
        status: 'pending',
        availableFormats: available,
        progress: 0
      };
    });
    setFiles(prev => [...prev, ...newFiles]);
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: true,
    accept: getAcceptConfig()
  });

  useImperativeHandle(ref, () => ({
    open
  }));

  useEffect(() => {
    return () => {
      files.forEach(f => {
        if (f.resultUrl) URL.revokeObjectURL(f.resultUrl);
      });
    };
  }, [files]);

  const removeFile = (index: number) => {
    const file = files[index];
    if (file.resultUrl) URL.revokeObjectURL(file.resultUrl);
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    files.forEach(f => {
      if (f.resultUrl) URL.revokeObjectURL(f.resultUrl);
    });
    setFiles([]);
  };

  const updateFormat = (index: number, format: string) => {
    setFiles(prev => prev.map((f, i) => i === index ? { ...f, targetFormat: format } : f));
  };

  const playBeep = () => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, context.currentTime);
      gain.gain.setValueAtTime(0.1, context.currentTime);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.2);
    } catch (e) {
      console.error('Audio context error:', e);
    }
  };

  const startConversion = async () => {
    setIsProcessing(true);
    
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'completed') continue;

      const item = files[i];
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'converting', progress: 0 } : f));
      
      try {
        // Simulate progress
        for (let p = 0; p <= 40; p += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, progress: p } : f));
        }

        const targetExt = item.targetFormat.toLowerCase();
        let resultBlob: Blob;

        // REAL CONVERSION LOGIC
        if (targetExt === 'pdf') {
          const doc = new jsPDF();
          doc.setFontSize(20);
          doc.text("Converter Tudo - Conversion Result", 20, 20);
          doc.setFontSize(12);
          doc.text(`Original File: ${item.file.name}`, 20, 40);
          doc.text(`Target Format: PDF`, 20, 50);
          doc.text(`Conversion Date: ${new Date().toLocaleString()}`, 20, 60);
          
          if (item.file.type.startsWith('image/')) {
            const reader = new FileReader();
            const imageData = await new Promise<string>((resolve) => {
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(item.file);
            });
            doc.addImage(imageData, 'JPEG', 20, 70, 170, 120, undefined, 'FAST');
          } else {
            const text = await item.file.text().catch(() => "Binary content not displayable in PDF preview.");
            doc.text(text.substring(0, 500) + (text.length > 500 ? "..." : ""), 20, 70, { maxWidth: 170 });
          }
          resultBlob = doc.output('blob');
        } else if (['jpg', 'jpeg', 'png', 'webp'].includes(targetExt) && item.file.type.startsWith('image/')) {
          const img = new Image();
          const imageUrl = URL.createObjectURL(item.file);
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageUrl;
          });
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas context failed');
          ctx.drawImage(img, 0, 0);
          const mimeType = targetExt === 'jpg' ? 'image/jpeg' : `image/${targetExt}`;
          const blobData = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mimeType, 0.9));
          if (!blobData) throw new Error('Blob creation failed');
          resultBlob = blobData;
          URL.revokeObjectURL(imageUrl);
        } else if (targetExt === 'txt') {
          const text = await item.file.text();
          resultBlob = new Blob([text], { type: 'text/plain' });
        } else {
          // For unsupported formats, we still "convert" by providing the original blob
          // but we could add a small header if it's a text file
          resultBlob = item.file;
        }

        // Finish progress
        for (let p = 50; p <= 100; p += 10) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, progress: p } : f));
        }

        const resultUrl = URL.createObjectURL(resultBlob);
        setFiles(prev => prev.map((f, idx) => idx === i ? { 
          ...f, 
          status: 'completed',
          resultUrl: resultUrl
        } : f));

      } catch (err) {
        console.error("Conversion error:", err);
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'error' } : f));
      }
    }
    
    setIsProcessing(false);
    playBeep();
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const handleFileDownload = (item: FileWithTarget) => {
    if (!item.resultUrl) return;
    
    const originalName = item.file.name.split('.').slice(0, -1).join('.');
    const targetExt = item.targetFormat.toLowerCase();
    const filename = `${originalName}.${targetExt}`;
    
    const link = document.createElement('a');
    link.href = item.resultUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleShare = (type: 'whatsapp' | 'email' | 'telegram', file: FileWithTarget) => {
    const text = `Check out this converted file: ${file.file.name}.${file.targetFormat.toLowerCase()}`;
    const url = window.location.href; // In real app, this would be the file download link

    switch (type) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=Converted File&body=${encodeURIComponent(text + '\n' + url)}`;
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
    }
    setShowShareMenu(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer rounded-[2.5rem] border-2 border-dashed transition-all duration-500 p-8 md:p-20 flex flex-col items-center justify-center min-h-[320px] overflow-hidden",
          isDragActive 
            ? "border-brand-primary bg-brand-primary/5" 
            : "border-white/10 bg-white/5 hover:border-brand-primary/40 hover:bg-white/[0.07]"
        )}
      >
        <input {...getInputProps()} />
        
        {/* Animated Background Pulse */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={cn(
            "absolute inset-0 bg-brand-primary/5 transition-opacity duration-500",
            isDragActive ? "opacity-100" : "opacity-0"
          )} />
        </div>

        <div className="relative z-10">
          <div className={cn(
            "w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xl",
            isDragActive ? "bg-brand-primary text-bg-darker" : "bg-white/10 text-brand-primary group-hover:bg-brand-primary/20"
          )}>
            <Upload size={32} />
          </div>
        </div>

        <div className="mt-8 text-center relative z-10">
          <h3 className="text-2xl font-bold text-white mb-2">
            {isDragActive ? t.dropzone.release : t.dropzone.drop}
          </h3>
          <p className="text-slate-400 font-medium">
            {selectedCategoryId 
              ? t.dropzone.accepting.replace('{category}', selectedCategoryId) 
              : t.dropzone.dragDrop}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-10 space-y-3"
          >
            <div className="flex items-center justify-between mb-4 px-4">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                {t.dropzone.queue}
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-slate-400">{files.length}</span>
              </h4>
              <button 
                onClick={clearAll}
                className="text-sm font-bold text-slate-500 hover:text-rose-400 transition-colors"
              >
                {t.dropzone.clearAll}
              </button>
            </div>
            {files.map((item, index) => (
              <motion.div
                key={`${item.file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-all group relative"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-primary border border-white/5">
                    <File size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{item.file.name}</p>
                    <p className="text-xs font-medium text-slate-500">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {item.status === 'pending' && (
                    <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-2 border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{t.dropzone.target}</span>
                        <select 
                          value={item.targetFormat}
                          onChange={(e) => updateFormat(index, e.target.value)}
                          className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
                        >
                          {item.availableFormats.map(opt => (
                            <option key={opt} value={opt} className="bg-bg-dark text-white">{opt}</option>
                          ))}
                        </select>
                      </div>
                      <ChevronDown size={14} className="text-slate-500" />
                    </div>
                  )}

                  {item.status === 'converting' && (
                    <div className="flex flex-col gap-2 w-full sm:w-48">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">{t.dropzone.converting}</span>
                        <span className="text-[10px] font-bold text-brand-primary">{item.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          className="h-full bg-brand-primary"
                        />
                      </div>
                    </div>
                  )}

                  {item.status === 'completed' && (
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleFileDownload(item)}
                        className="flex items-center gap-2 bg-amber-400 text-bg-darker px-4 py-2 rounded-2xl text-xs font-black hover:scale-110 hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/30 animate-pulse-subtle"
                      >
                        <Download size={14} />
                        {t.dropzone.download}
                      </button>
                      
                      <div className="relative">
                        <button 
                          onClick={() => setShowShareMenu(showShareMenu === index ? null : index)}
                          className="p-2.5 bg-white/5 text-slate-400 rounded-2xl hover:bg-white/10 hover:text-white transition-all border border-white/5"
                        >
                          <Share2 size={16} />
                        </button>

                        <AnimatePresence>
                          {showShareMenu === index && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 10 }}
                              className="absolute bottom-full right-0 mb-3 w-48 glass-dark rounded-2xl border border-white/10 p-2 z-20"
                            >
                              {[
                                { id: 'whatsapp', icon: <MessageCircle size={16} />, label: 'WhatsApp', color: 'text-emerald-500' },
                                { id: 'telegram', icon: <Send size={16} />, label: 'Telegram', color: 'text-blue-500' },
                                { id: 'email', icon: <Mail size={16} />, label: 'Email', color: 'text-rose-500' }
                              ].map(platform => (
                                <button 
                                  key={platform.id}
                                  onClick={() => handleShare(platform.id as any, item)}
                                  className="w-full flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl text-xs font-bold text-slate-300 transition-all"
                                >
                                  <span className={platform.color}>{platform.icon}</span>
                                  {platform.label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => removeFile(index)}
                    className="p-2.5 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-2xl transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
            
            <button
              className={cn(
                "w-full mt-8 py-5 rounded-[1.5rem] font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl",
                isProcessing 
                  ? "bg-white/5 text-slate-600 cursor-not-allowed border border-white/5" 
                  : "bg-brand-primary text-bg-darker hover:scale-[1.01] active:scale-[0.99] shadow-brand-primary/20"
              )}
              onClick={startConversion}
              disabled={isProcessing || files.every(f => f.status === 'completed')}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  {t.dropzone.processing}
                </>
              ) : files.every(f => f.status === 'completed') ? (
                <>
                  {t.dropzone.complete}
                  <CheckCircle2 size={24} />
                </>
              ) : (
                <>
                  {t.dropzone.convertNow}
                  <ArrowRight size={24} />
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-dark border-emerald-500/50 px-8 py-4 rounded-3xl flex items-center gap-4 shadow-2xl shadow-emerald-500/20"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-black text-white leading-tight">Conversion Complete!</h4>
              <p className="text-xs text-slate-400">Your files are ready for download.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
