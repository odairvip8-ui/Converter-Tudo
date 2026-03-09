import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, PenTool, Eraser, Check, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, MousePointer2, Layers } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfSignerProps {
  file: File;
  isOpen: boolean;
  onClose: () => void;
  onSave: (signedBlob: Blob) => void;
}

export const PdfSigner: React.FC<PdfSignerProps> = ({ file, isOpen, onClose, onSave }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.5);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signaturePos, setSignaturePos] = useState({ x: 100, y: 100 });
  const [isPlacingSignature, setIsPlacingSignature] = useState(false);
  const [showWhoModal, setShowWhoModal] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !file) return;

    const loadPdf = async () => {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
      renderPage(pdf, 1, scale);
    };

    loadPdf();
  }, [isOpen, file]);

  const renderPage = async (pdf: pdfjsLib.PDFDocumentProxy, pageNum: number, currentScale: number) => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: currentScale });
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    } as any;

    await page.render(renderContext).promise;
  };

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pdfDoc, currentPage, scale);
    }
  }, [currentPage, scale, pdfDoc]);

  const handleClearSignature = () => {
    sigCanvasRef.current?.clear();
    setSignatureData(null);
  };

  const handleSaveSignature = () => {
    if (sigCanvasRef.current?.isEmpty()) return;
    setSignatureData(sigCanvasRef.current?.getTrimmedCanvas().toDataURL('image/png') || null);
    setIsDrawing(false);
  };

  const handlePlaceSignature = (e: React.MouseEvent) => {
    if (!signatureData || !isPlacingSignature) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setSignaturePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsPlacingSignature(false);
  };

  const handleFinalize = async () => {
    // In a real app, we'd use pdf-lib to burn the signature into the PDF
    // For this demo, we'll simulate the save
    onSave(file); // Just returning original for now, but UI shows the intent
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex flex-col bg-[#f0f0f0] overflow-hidden">
      {/* Who is signing modal */}
      <AnimatePresence>
        {showWhoModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-12 shadow-2xl text-center"
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-10">Quem vais assinar esse documento?</h3>
              
              <div className="grid grid-cols-2 gap-8">
                <button 
                  onClick={() => setShowWhoModal(false)}
                  className="group flex flex-col items-center gap-6 p-8 rounded-3xl border-2 border-transparent hover:border-rose-500 hover:bg-rose-50 transition-all"
                >
                  <div className="w-32 h-32 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                    <PenTool size={48} className="text-slate-400 group-hover:text-rose-500" />
                  </div>
                  <div>
                    <span className="block bg-rose-500 text-white px-4 py-1.5 rounded-full text-xs font-black mb-2">Apenas eu</span>
                    <span className="text-xs text-slate-500">Assine esse documento</span>
                  </div>
                </button>

                <button 
                  onClick={() => setShowWhoModal(false)}
                  className="group flex flex-col items-center gap-6 p-8 rounded-3xl border-2 border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all opacity-50 grayscale"
                >
                  <div className="w-32 h-32 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <Layers size={48} className="text-slate-400" />
                  </div>
                  <div>
                    <span className="block bg-slate-500 text-white px-4 py-1.5 rounded-full text-xs font-black mb-2">Várias pessoas</span>
                    <span className="text-xs text-slate-500">Convide outros para assinar</span>
                  </div>
                </button>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-100">
                <p className="text-xs text-slate-400">Documentos carregados: <span className="font-bold text-slate-600">{file.name}</span></p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="h-16 bg-white border-bottom border-slate-200 flex items-center justify-between px-6 shadow-sm z-20">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-600" />
          </button>
          <h2 className="font-bold text-slate-800 truncate max-w-[200px]">{file.name}</h2>
          <div className="h-6 w-[1px] bg-slate-200 mx-2" />
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1">
            <button 
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1 disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-bold text-slate-700 min-w-[50px] text-center">
              {currentPage} / {numPages}
            </span>
            <button 
              disabled={currentPage >= numPages}
              onClick={() => setCurrentPage(prev => Math.min(numPages, prev + 1))}
              className="p-1 disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 mr-4">
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="p-1.5 hover:bg-white rounded-md transition-all">
              <ZoomOut size={18} />
            </button>
            <span className="text-xs font-bold text-slate-500 px-2">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="p-1.5 hover:bg-white rounded-md transition-all">
              <ZoomIn size={18} />
            </button>
          </div>
          <button 
            onClick={handleFinalize}
            className="flex items-center gap-2 bg-rose-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
          >
            <Check size={18} />
            Finalizar e Assinar
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col p-6 overflow-y-auto">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Opções de assinatura</h3>
          
          <div className="space-y-6">
            <div className="p-4 rounded-2xl border-2 border-rose-500 bg-rose-50 flex flex-col items-center gap-3 cursor-pointer">
              <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white">
                <PenTool size={24} />
              </div>
              <span className="font-bold text-rose-600">Assinatura Simples</span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 flex flex-col items-center gap-3 cursor-pointer transition-all opacity-50 grayscale">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                <Check size={24} />
              </div>
              <span className="font-bold text-slate-500">Assinatura Digital</span>
            </div>

            <div className="mt-10">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Sua Assinatura</h4>
              
              {!signatureData ? (
                <button 
                  onClick={() => setIsDrawing(true)}
                  className="w-full py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-rose-300 hover:text-rose-400 transition-all"
                >
                  <PenTool size={32} />
                  <span className="text-xs font-bold">Clique para desenhar</span>
                </button>
              ) : (
                <div className="relative group">
                  <div className="w-full h-32 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center p-4">
                    <img src={signatureData} alt="Signature" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => setIsPlacingSignature(true)}
                      className="p-2 bg-white text-slate-800 rounded-full hover:scale-110 transition-all"
                      title="Posicionar no documento"
                    >
                      <MousePointer2 size={18} />
                    </button>
                    <button 
                      onClick={() => setSignatureData(null)}
                      className="p-2 bg-rose-500 text-white rounded-full hover:scale-110 transition-all"
                      title="Remover"
                    >
                      <Eraser size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-[#f0f0f0] p-12 flex justify-center items-start relative" ref={containerRef}>
          <div className="relative shadow-2xl bg-white">
            <canvas ref={canvasRef} className="max-w-full" />
            
            {/* Signature Overlay */}
            {signatureData && (
              <motion.div 
                drag
                dragConstraints={containerRef}
                initial={{ x: signaturePos.x, y: signaturePos.y }}
                className="absolute cursor-move group z-10"
                style={{ left: 0, top: 0 }}
              >
                <div className="relative">
                  <img 
                    src={signatureData} 
                    alt="Signature Overlay" 
                    className="w-40 h-auto pointer-events-none border border-transparent group-hover:border-rose-500/50 group-hover:bg-rose-500/5" 
                  />
                  <div className="absolute -top-3 -right-3 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <MousePointer2 size={12} />
                  </div>
                </div>
              </motion.div>
            )}

            {isPlacingSignature && (
              <div className="absolute inset-0 bg-rose-500/10 cursor-crosshair flex items-center justify-center z-30">
                <div className="bg-white px-4 py-2 rounded-full shadow-lg text-rose-500 font-bold text-sm">
                  Clique onde deseja colocar a assinatura
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawing Modal */}
      <AnimatePresence>
        {isDrawing && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsDrawing(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Desenhe sua assinatura</h3>
                <button onClick={() => setIsDrawing(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl h-64 overflow-hidden mb-6">
                <SignatureCanvas 
                  ref={sigCanvasRef}
                  penColor="black"
                  canvasProps={{ className: 'w-full h-full cursor-crosshair' }}
                />
              </div>

              <div className="flex items-center justify-between">
                <button 
                  onClick={handleClearSignature}
                  className="flex items-center gap-2 text-slate-500 font-bold hover:text-rose-500 transition-colors"
                >
                  <Eraser size={18} />
                  Limpar
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsDrawing(false)}
                    className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveSignature}
                    className="px-8 py-2.5 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
                  >
                    Salvar Assinatura
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
