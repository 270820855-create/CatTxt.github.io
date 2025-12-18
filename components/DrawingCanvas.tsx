import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Trash2, Send, Palette, Square, Pencil, Minus, Circle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DrawingCanvasProps {
  onSave: (image: string) => void;
}

type Tool = 'brush' | 'line' | 'rect' | 'circle' | 'eraser';

const COLORS = [
  '#000000', // Black
  '#FFB7B2', // Q-Pink
  '#A2E1DB', // Q-Blue
  '#FDFD96', // Q-Yellow
  '#C7CEEA', // Q-Purple
  '#FF6B6B', // Red
  '#4D96FF', // Blue
  '#6BCB77', // Green
];

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onSave }) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [tool, setTool] = useState<Tool>('brush');
  
  // States for shape drawing
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (context) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        setCtx(context);
        
        // Fill white background
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ctx || !canvasRef.current) return;
    const pos = getPos(e);
    setIsDrawing(true);
    setStartPos(pos);
    
    // Save current state for previewing shapes
    setSnapshot(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));

    if (tool === 'brush' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx || !snapshot || !canvasRef.current) return;
    const pos = getPos(e);

    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
    ctx.fillStyle = color;

    if (tool === 'brush' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else {
      // For shapes, we restore the snapshot before drawing the preview
      ctx.putImageData(snapshot, 0, 0);
      
      if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === 'circle') {
        ctx.beginPath();
        const radius = Math.sqrt(Math.pow(startPos.x - pos.x, 2) + Math.pow(startPos.y - pos.y, 2));
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (ctx) ctx.closePath();
    setSnapshot(null);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onSave(dataUrl);
    clearCanvas();
  };

  const toolClass = (current: Tool) => `p-3 rounded-2xl transition-all border-2 flex items-center justify-center ${tool === current ? 'bg-q-purple text-white border-q-purple shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-q-purple/30'}`;

  return (
    <div className="bg-white rounded-4xl shadow-2xl p-6 border-8 border-white animate-fadeInUp">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-100 rounded-2xl text-pink-500">
              <Palette className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">{t('myPosts')}</h2>
              <p className="text-gray-400 font-bold text-sm">Draw your mood today!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={clearCanvas}
              className="p-3 hover:bg-red-50 text-red-400 rounded-2xl transition-colors border-2 border-transparent hover:border-red-100"
              title="Clear"
            >
              <Trash2 className="w-6 h-6" />
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-gradient-to-r from-q-pink to-q-purple text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Send className="w-5 h-5" />
              <span>{t('post')}</span>
            </button>
          </div>
        </div>

        {/* Tools Selector */}
        <div className="flex gap-3 bg-gray-50 p-3 rounded-3xl w-fit">
          <button onClick={() => setTool('brush')} className={toolClass('brush')} title="Pencil">
            <Pencil className="w-6 h-6" />
          </button>
          <button onClick={() => setTool('line')} className={toolClass('line')} title="Line">
            <Minus className="w-6 h-6" />
          </button>
          <button onClick={() => setTool('rect')} className={toolClass('rect')} title="Square">
            <Square className="w-6 h-6" />
          </button>
          <button onClick={() => setTool('circle')} className={toolClass('circle')} title="Circle">
            <Circle className="w-6 h-6" />
          </button>
          <button onClick={() => setTool('eraser')} className={toolClass('eraser')} title="Eraser">
            <Eraser className="w-6 h-6" />
          </button>
        </div>

        <div className="relative border-4 border-gray-100 rounded-3xl overflow-hidden cursor-crosshair shadow-inner bg-gray-50">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-auto bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 bg-gray-50 p-6 rounded-3xl">
          <div className="flex flex-wrap gap-3">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-10 h-10 rounded-full border-4 transition-all transform hover:scale-110 ${color === c ? 'border-gray-800 scale-110 shadow-lg' : 'border-white'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-xs">
            <div className="text-gray-400 font-black">Size</div>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-q-purple"
            />
            <span className="font-black text-gray-400 w-8">{brushSize}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;