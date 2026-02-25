import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, RefreshCw, Check, Download, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface CameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (blob: Blob, name: string) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ isOpen, onClose, onSave }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    setIsStarting(true);
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Não foi possível aceder à câmara. Verifique as permissões.");
    } finally {
      setIsStarting(false);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const saveAsPdf = () => {
    if (capturedImage) {
      const pdf = new jsPDF();
      const img = new Image();
      img.src = capturedImage;
      img.onload = () => {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = img.width;
        const imgHeight = img.height;
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        const width = imgWidth * ratio;
        const height = imgHeight * ratio;
        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;
        
        pdf.addImage(capturedImage, 'JPEG', x, y, width, height);
        const pdfBlob = pdf.output('blob');
        const fileName = `digitalizacao_${new Date().getTime()}.pdf`;
        
        if (onSave) {
          onSave(pdfBlob, fileName);
        } else {
          const url = URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.click();
          URL.revokeObjectURL(url);
        }
        
        handleClose();
      };
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setError(null);
    onClose();
  };

  React.useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-bg-darker/90 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl glass-dark rounded-[2.5rem] overflow-hidden border border-white/10 flex flex-col h-[80vh]"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
              <Camera size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Digitalizar para PDF</h2>
              <p className="text-xs text-slate-500">Capture documentos com a sua câmara</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Viewport */}
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              {isStarting && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <RefreshCw className="text-white animate-spin" size={40} />
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-8 text-center">
                  <X className="text-rose-500 mb-4" size={48} />
                  <p className="text-white font-medium mb-6">{error}</p>
                  <button onClick={startCamera} className="btn-primary">Tentar Novamente</button>
                </div>
              )}
              {/* Overlay for framing */}
              <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                <div className="w-full h-full border-2 border-white/20 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-primary -mt-1 -ml-1" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-primary -mt-1 -mr-1" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-primary -ml-1 -mb-1" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-primary -mr-1 -mb-1" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="p-8 bg-bg-darker/50 backdrop-blur-xl border-t border-white/5">
          <div className="flex items-center justify-center gap-6">
            {!capturedImage ? (
              <button 
                onClick={capturePhoto}
                disabled={!stream || isStarting}
                className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <div className="w-16 h-16 rounded-full border-4 border-bg-darker" />
              </button>
            ) : (
              <>
                <button 
                  onClick={retake}
                  className="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                    <RefreshCw size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">Repetir</span>
                </button>
                
                <button 
                  onClick={saveAsPdf}
                  className="flex flex-col items-center gap-2 text-brand-primary hover:text-brand-primary/80 transition-colors"
                >
                  <div className="w-20 h-20 rounded-full bg-brand-primary text-bg-darker flex items-center justify-center shadow-xl shadow-brand-primary/20">
                    <Check size={40} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">Finalizar PDF</span>
                </button>

                <div className="flex flex-col items-center gap-2 text-slate-400 opacity-50">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">Páginas: 1</span>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
