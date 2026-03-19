import React, { useRef, useState, useEffect } from 'react';
import { Eraser, CheckCircle, X, Maximize2 } from 'lucide-react';

export const SignaturePad: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false); 
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (canvas && container) {
          canvas.width = container.offsetWidth;
          canvas.height = 300;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#1e293b';
          }
        }
      }, 100);
    }
  }, [isOpen]);

  const startDrawing = (e: any) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    canvasRef.current?.getContext('2d')?.beginPath();
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    setIsEmpty(false);
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setIsEmpty(true);
    }
  };

  return (
    <>
      
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm w-full">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Legal Signature</h3>
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 transition-all"
        >
          <Maximize2 size={18} />
          <span className="font-medium text-sm">Click to Sign Full Screen</span>
        </button>
      </div>

      
      {isOpen && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Digital Signature Pad</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4 text-center">Please use your mouse or touch screen to provide your legal signature below.</p>
              
              <div ref={containerRef} className="relative border-2 border-gray-200 rounded-xl bg-gray-50 h-[300px] w-full touch-none overflow-hidden">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="cursor-crosshair block w-full h-full"
                />
                {isEmpty && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-gray-400 italic">Sign here...</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={clearCanvas}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 flex items-center justify-center space-x-2"
                >
                  <Eraser size={18} />
                  <span>Clear Pad</span>
                </button>
                <button 
                  onClick={() => { alert('Signed Successfully!'); setIsOpen(false); }}
                  disabled={isEmpty}
                  className={`flex-[2] py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all ${
                    isEmpty ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20'
                  }`}
                >
                  <CheckCircle size={18} />
                  <span>Confirm Signature</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
