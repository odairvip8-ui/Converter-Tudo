import React, { useCallback, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { jsPDF } from 'jspdf';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
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
  ArrowRight,
  FileArchive,
  Layers
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
  compact?: boolean;
  mode?: 'merge' | 'split' | 'compress' | 'sign' | 'edit' | 'default';
}

interface SplitResult {
  name: string;
  url: string;
  blob: Blob;
}

interface FileWithTarget {
  file: File;
  targetFormat: string;
  status: 'pending' | 'converting' | 'completed' | 'error';
  resultUrl?: string;
  splitResults?: SplitResult[];
  previewUrl?: string;
  availableFormats: string[];
  progress: number;
}

export const FileDropzone = forwardRef<FileDropzoneHandle, FileDropzoneProps>(({ onFilesSelected, selectedCategoryId, compact, mode = 'default' }, ref) => {
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
      const isImage = f.type.startsWith('image/');
      
      // Force PDF for specialized modes
      const isSpecialized = mode !== 'default';
      const targetFormat = isSpecialized ? 'PDF' : (available[0] || 'PDF');
      const availableFormats = isSpecialized ? ['PDF'] : available;

      return {
        file: f,
        targetFormat,
        status: 'pending',
        availableFormats,
        progress: 0,
        previewUrl: isImage ? URL.createObjectURL(f) : undefined
      };
    });
    setFiles(prev => [...prev, ...newFiles]);
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected, mode]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: true,
    accept: getAcceptConfig()
  });

  useImperativeHandle(ref, () => ({
    open
  }));

  // Only revoke URLs on unmount to prevent premature revocation during state updates
  useEffect(() => {
    return () => {
      files.forEach(f => {
        if (f.resultUrl) URL.revokeObjectURL(f.resultUrl);
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
        if (f.splitResults) {
          f.splitResults.forEach(r => URL.revokeObjectURL(r.url));
        }
      });
    };
  }, []); // Empty dependency array for unmount only

  const removeFile = (index: number) => {
    const file = files[index];
    if (file.resultUrl) URL.revokeObjectURL(file.resultUrl);
    if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
    if (file.splitResults) {
      file.splitResults.forEach(r => URL.revokeObjectURL(r.url));
    }
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    files.forEach(f => {
      if (f.resultUrl) URL.revokeObjectURL(f.resultUrl);
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      if (f.splitResults) {
        f.splitResults.forEach(r => URL.revokeObjectURL(r.url));
      }
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
    
    // Special case: Merge mode
    if (mode === 'merge' && files.length > 1) {
      try {
        const mergedPdf = await PDFDocument.create();
        for (const item of files) {
          if (item.file.type === 'application/pdf') {
            const pdfBytes = await item.file.arrayBuffer();
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
          } else if (item.file.type.startsWith('image/')) {
            // Convert image to PDF page first
            const pdf = new jsPDF();
            const reader = new FileReader();
            const imageData = await new Promise<string>((resolve) => {
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(item.file);
            });
            pdf.addImage(imageData, 'JPEG', 0, 0, 210, 297); // A4
            const pdfBytes = pdf.output('arraybuffer');
            const loadedPdf = await PDFDocument.load(pdfBytes);
            const [page] = await mergedPdf.copyPages(loadedPdf, [0]);
            mergedPdf.addPage(page);
          }
        }
        const mergedPdfBytes = await mergedPdf.save();
        const resultBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const resultUrl = URL.createObjectURL(resultBlob);
        const fileName = `merged_${new Date().getTime()}.pdf`;
        
        // Mark all as completed and point to the same result
        setFiles(prev => prev.map(f => ({ 
          ...f, 
          status: 'completed', 
          progress: 100, 
          resultUrl,
          targetFormat: 'pdf'
        })));
        
        const historyItem = { name: fileName, date: new Date().toLocaleString() };
        const existingHistory = JSON.parse(localStorage.getItem('converter_history') || '[]');
        localStorage.setItem('converter_history', JSON.stringify([historyItem, ...existingHistory].slice(0, 20)));
        
        // Trigger automatic download
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setIsProcessing(false);
        playBeep();
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
        return;
      } catch (err) {
        console.error("Merge error:", err);
      }
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'completed') continue;

      const item = files[i];
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'converting', progress: 0 } : f));
      
      try {
        // Simulate progress
        for (let p = 0; p <= 40; p += 10) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, progress: p } : f));
        }

        const targetExt = item.targetFormat.toLowerCase();
        let resultBlob: Blob;

        // MODE-SPECIFIC LOGIC
        if (mode === 'compress') {
          if (item.file.type === 'application/pdf') {
            // Simple compression: Re-save with pdf-lib (often reduces size slightly)
            const pdfBytes = await item.file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
            resultBlob = new Blob([compressedBytes], { type: 'application/pdf' });
          } else if (item.file.type.startsWith('image/')) {
            // Real image compression using canvas
            const img = new Image();
            const imageUrl = URL.createObjectURL(item.file);
            await new Promise((resolve) => {
              img.onload = resolve;
              img.src = imageUrl;
            });
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            resultBlob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.5)) as Blob;
            URL.revokeObjectURL(imageUrl);
          } else {
            resultBlob = item.file;
          }
        } else if (mode === 'split' && item.file.type === 'application/pdf') {
          const pdfBytes = await item.file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(pdfBytes);
          const pageCount = pdfDoc.getPageCount();
          const splitResults: SplitResult[] = [];
          
          const originalName = item.file.name.split('.').slice(0, -1).join('.');

          for (let p = 0; p < pageCount; p++) {
            const newPdf = await PDFDocument.create();
            const [page] = await newPdf.copyPages(pdfDoc, [p]);
            newPdf.addPage(page);
            const splitBytes = await newPdf.save();
            const blob = new Blob([splitBytes], { type: 'application/pdf' });
            const name = `${originalName}_pagina_${p + 1}.pdf`;
            splitResults.push({
              name,
              blob,
              url: URL.createObjectURL(blob)
            });
            
            // Update progress based on pages
            const progress = 40 + Math.floor(((p + 1) / pageCount) * 60);
            setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, progress } : f));
          }

          setFiles(prev => prev.map((f, idx) => idx === i ? { 
            ...f, 
            status: 'completed',
            splitResults
          } : f));

          // Trigger automatic download of ZIP if more than 1 page, or just the page if 1
          if (splitResults.length === 1) {
            const link = document.createElement('a');
            link.href = splitResults[0].url;
            link.download = splitResults[0].name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            const zip = new JSZip();
            splitResults.forEach(res => {
              zip.file(res.name, res.blob);
            });
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const zipUrl = URL.createObjectURL(zipBlob);
            const link = document.createElement('a');
            link.href = zipUrl;
            link.download = `${originalName}_paginas.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Save ZIP to history
            const historyItem = { name: `${originalName}_paginas.zip`, date: new Date().toLocaleString() };
            const existingHistory = JSON.parse(localStorage.getItem('converter_history') || '[]');
            localStorage.setItem('converter_history', JSON.stringify([historyItem, ...existingHistory].slice(0, 20)));
            
            URL.revokeObjectURL(zipUrl);
          }
          continue; // Skip the default history/status update below
        } else if (mode === 'sign' && item.file.type === 'application/pdf') {
          const pdfBytes = await item.file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(pdfBytes);
          const pages = pdfDoc.getPages();
          const firstPage = pages[0];
          const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
          firstPage.drawText('Assinado Digitalmente', {
            x: 50,
            y: 50,
            size: 12,
            font: font,
            color: rgb(0, 0, 0.5),
          });
          const signedBytes = await pdfDoc.save();
          resultBlob = new Blob([signedBytes], { type: 'application/pdf' });
        } else if (mode === 'edit' && item.file.type === 'application/pdf') {
          const pdfBytes = await item.file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(pdfBytes);
          const pages = pdfDoc.getPages();
          const firstPage = pages[0];
          const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
          firstPage.drawText('EDITADO - CONVERTER TUDO', {
            x: 50,
            y: firstPage.getHeight() - 50,
            size: 10,
            font: font,
            color: rgb(0.5, 0.5, 0.5),
          });
          const editedBytes = await pdfDoc.save();
          resultBlob = new Blob([editedBytes], { type: 'application/pdf' });
        } else if (targetExt === 'pdf') {
          // Create a real PDF using jsPDF (default is A4)
          const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });
          
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          const margin = 10;
          const contentWidth = pageWidth - (margin * 2);
          
          if (item.file.type.startsWith('image/')) {
            const reader = new FileReader();
            const imageData = await new Promise<string>((resolve) => {
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(item.file);
            });

            // Get image dimensions to scale correctly
            const img = new Image();
            await new Promise((resolve) => {
              img.onload = resolve;
              img.src = imageData;
            });

            const imgWidth = img.width;
            const imgHeight = img.height;
            const ratio = imgWidth / imgHeight;
            
            let finalWidth = contentWidth;
            let finalHeight = finalWidth / ratio;
            
            // If height exceeds page height, scale down further
            if (finalHeight > (pageHeight - (margin * 2))) {
              finalHeight = pageHeight - (margin * 2);
              finalWidth = finalHeight * ratio;
            }

            // Center the image
            const x = (pageWidth - finalWidth) / 2;
            const y = (pageHeight - finalHeight) / 2;

            doc.addImage(imageData, 'JPEG', x, y, finalWidth, finalHeight, undefined, 'FAST');
          } else {
            try {
              const text = await item.file.text();
              doc.setFontSize(11);
              const splitText = doc.splitTextToSize(text, contentWidth);
              doc.text(splitText, margin, margin + 5);
            } catch (e) {
              // If text reading fails (binary file), just put the filename
              doc.setFontSize(14);
              doc.text(`Arquivo: ${item.file.name}`, margin, margin + 10);
              doc.setFontSize(10);
              doc.text(`Este arquivo foi convertido para o formato PDF.`, margin, margin + 20);
            }
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

        // Trigger automatic download for specialized modes
        if (mode !== 'default') {
          const originalName = item.file.name.split('.').slice(0, -1).join('.');
          const filename = `${originalName}.${targetExt}`;
          const link = document.createElement('a');
          link.href = resultUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        // Save to history
        const historyItem = {
          name: `${item.file.name.split('.').slice(0, -1).join('.')}.${targetExt}`,
          date: new Date().toLocaleString()
        };
        const existingHistory = JSON.parse(localStorage.getItem('converter_history') || '[]');
        localStorage.setItem('converter_history', JSON.stringify([historyItem, ...existingHistory].slice(0, 20)));

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
    
    try {
      const link = document.createElement('a');
      link.href = item.resultUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Small delay before removing to ensure browser processes the click
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);

      // Fallback for mobile in-app browsers (like Messenger/Facebook)
      // which often block the 'download' attribute on blob URLs
      const isMobileInApp = /FBAN|FBAV|Messenger|Instagram/i.test(navigator.userAgent);
      if (isMobileInApp) {
        window.open(item.resultUrl, '_blank');
      }
    } catch (err) {
      console.error("Download failed:", err);
      // Last resort fallback
      window.open(item.resultUrl, '_blank');
    }
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

  const getButtonText = () => {
    if (isProcessing) return t.dropzone.processing;
    if (files.every(f => f.status === 'completed')) return t.dropzone.complete;
    
    switch (mode) {
      case 'merge': return 'Juntar Agora';
      case 'split': return 'Dividir Agora';
      case 'compress': return 'Comprimir Agora';
      case 'sign': return 'Assinar Agora';
      case 'edit': return 'Editar Agora';
      default: return t.dropzone.convertNow;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center overflow-hidden",
          compact ? "p-6 md:p-10 min-h-[200px]" : "p-8 md:p-20 min-h-[320px]",
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
            "rounded-[2rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xl",
            compact ? "w-12 h-12" : "w-20 h-20",
            isDragActive ? "bg-brand-primary text-bg-darker" : "bg-white/10 text-brand-primary group-hover:bg-brand-primary/20"
          )}>
            <Upload size={compact ? 20 : 32} />
          </div>
        </div>

        <div className={cn("text-center relative z-10", compact ? "mt-4" : "mt-8")}>
          <h3 className={cn("font-bold text-white mb-2", compact ? "text-lg" : "text-2xl")}>
            {isDragActive ? t.dropzone.release : t.dropzone.drop}
          </h3>
          <p className={cn("text-slate-400 font-medium", compact ? "text-xs" : "text-slate-400")}>
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
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-primary border border-white/5 overflow-hidden">
                    {item.previewUrl ? (
                      <img src={item.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <File size={20} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{item.file.name}</p>
                    <p className="text-xs font-medium text-slate-500">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {item.status === 'pending' && mode === 'default' && (
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
                      {item.splitResults && (
                        <div className="flex flex-wrap gap-2 mr-2">
                          <button 
                            onClick={async () => {
                              const zip = new JSZip();
                              item.splitResults?.forEach(res => zip.file(res.name, res.blob));
                              const zipBlob = await zip.generateAsync({ type: 'blob' });
                              const url = URL.createObjectURL(zipBlob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `${item.file.name.split('.').slice(0, -1).join('.')}_paginas.zip`;
                              link.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="flex items-center gap-2 bg-indigo-500 text-white px-3 py-2 rounded-2xl text-[10px] font-black hover:scale-105 transition-all shadow-lg shadow-indigo-500/20"
                          >
                            <FileArchive size={14} />
                            ZIP ({item.splitResults.length})
                          </button>
                          
                          <div className="flex gap-1 overflow-x-auto max-w-[150px] pb-1 custom-scrollbar">
                            {item.splitResults.map((res, ridx) => (
                              <button 
                                key={ridx}
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = res.url;
                                  link.download = res.name;
                                  link.click();
                                }}
                                title={res.name}
                                className="flex items-center justify-center bg-white/10 text-slate-300 w-8 h-8 rounded-xl text-[9px] font-bold hover:bg-white/20 transition-all shrink-0"
                              >
                                {ridx + 1}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.resultUrl && (
                        <button 
                          onClick={() => handleFileDownload(item)}
                          className="flex items-center gap-2 bg-amber-400 text-bg-darker px-4 py-2 rounded-2xl text-xs font-black hover:scale-110 hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/30 animate-pulse-subtle"
                        >
                          <Download size={14} />
                          {t.dropzone.download}
                        </button>
                      )}
                      
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
                  {getButtonText()}
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
              <h4 className="font-black text-white leading-tight">{t.dropzone.toastTitle}</h4>
              <p className="text-xs text-slate-400">{t.dropzone.toastDesc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
