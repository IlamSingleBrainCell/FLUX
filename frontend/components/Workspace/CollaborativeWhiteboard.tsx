// components/Workspace/CollaborativeWhiteboard.tsx
import React, { useState, useRef, useEffect } from 'react';

interface DrawingElement {
  id: string;
  type: 'line' | 'rectangle' | 'circle' | 'text' | 'arrow';
  color: string;
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
  strokeWidth: number;
}

interface CollaborativeWhiteboardProps {
  onClose: () => void;
  isOpen: boolean;
  className?: string;
}

export const CollaborativeWhiteboard: React.FC<CollaborativeWhiteboardProps> = ({
  onClose,
  isOpen,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [currentTool, setCurrentTool] = useState<'pen' | 'rectangle' | 'circle' | 'text' | 'eraser'>('pen');
  const [currentColor, setCurrentColor] = useState('#3b82f6');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#000000', '#ffffff'];
  
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all elements
    elements.forEach(element => {
      ctx.strokeStyle = element.color;
      ctx.lineWidth = element.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (element.type === 'line' && element.points) {
        ctx.beginPath();
        element.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      } else if (element.type === 'rectangle' && element.x !== undefined && element.y !== undefined && element.width && element.height) {
        ctx.strokeRect(element.x, element.y, element.width, element.height);
      } else if (element.type === 'circle' && element.x !== undefined && element.y !== undefined && element.width) {
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.width, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (element.type === 'text' && element.x !== undefined && element.y !== undefined && element.text) {
        ctx.fillStyle = element.color;
        ctx.font = `${element.strokeWidth * 8}px Arial`;
        ctx.fillText(element.text, element.x, element.y);
      }
    });

    // Draw current element being created
    if (currentElement) {
      ctx.strokeStyle = currentElement.color;
      ctx.lineWidth = currentElement.strokeWidth;

      if (currentElement.type === 'line' && currentElement.points) {
        ctx.beginPath();
        currentElement.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      } else if (currentElement.type === 'rectangle' && currentElement.x !== undefined && currentElement.y !== undefined && currentElement.width && currentElement.height) {
        ctx.strokeRect(currentElement.x, currentElement.y, currentElement.width, currentElement.height);
      } else if (currentElement.type === 'circle' && currentElement.x !== undefined && currentElement.y !== undefined && currentElement.width) {
        ctx.beginPath();
        ctx.arc(currentElement.x, currentElement.y, currentElement.width, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }, [elements, currentElement]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    if (currentTool === 'pen') {
      setCurrentElement({
        id: Date.now().toString(),
        type: 'line',
        color: currentColor,
        points: [{ x, y }],
        strokeWidth,
      });
    } else if (currentTool === 'rectangle') {
      setCurrentElement({
        id: Date.now().toString(),
        type: 'rectangle',
        color: currentColor,
        x,
        y,
        width: 0,
        height: 0,
        strokeWidth,
      });
    } else if (currentTool === 'circle') {
      setCurrentElement({
        id: Date.now().toString(),
        type: 'circle',
        color: currentColor,
        x,
        y,
        width: 0,
        strokeWidth,
      });
    } else if (currentTool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const newElement: DrawingElement = {
          id: Date.now().toString(),
          type: 'text',
          color: currentColor,
          x,
          y,
          text,
          strokeWidth,
        };
        setElements([...elements, newElement]);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === 'pen') {
      setCurrentElement({
        ...currentElement,
        points: [...(currentElement.points || []), { x, y }],
      });
    } else if (currentTool === 'rectangle' && currentElement.x !== undefined && currentElement.y !== undefined) {
      setCurrentElement({
        ...currentElement,
        width: x - currentElement.x,
        height: y - currentElement.y,
      });
    } else if (currentTool === 'circle' && currentElement.x !== undefined && currentElement.y !== undefined) {
      const radius = Math.sqrt(Math.pow(x - currentElement.x, 2) + Math.pow(y - currentElement.y, 2));
      setCurrentElement({
        ...currentElement,
        width: radius,
      });
    }
  };

  const stopDrawing = () => {
    if (currentElement && currentTool !== 'text') {
      setElements([...elements, currentElement]);
    }
    setIsDrawing(false);
    setCurrentElement(null);
  };

  const clearCanvas = () => {
    setElements([]);
  };

  const exportAsImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = url;
    link.click();
  };

  const undo = () => {
    setElements(elements.slice(0, -1));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Collaborative Whiteboard</h2>
                <p className="text-sm text-slate-500">Draw diagrams and share ideas</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={undo} className="px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2" title="Undo">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button onClick={clearCanvas} className="px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors text-sm">Clear</button>
              <button onClick={exportAsImage} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-4 mt-4">
            {/* Tools */}
            <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
              <button onClick={() => setCurrentTool('pen')} className={`p-2 rounded ${currentTool === 'pen' ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100'}`} title="Pen">✏️</button>
              <button onClick={() => setCurrentTool('rectangle')} className={`p-2 rounded ${currentTool === 'rectangle' ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100'}`} title="Rectangle">⬜</button>
              <button onClick={() => setCurrentTool('circle')} className={`p-2 rounded ${currentTool === 'circle' ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100'}`} title="Circle">⭕</button>
              <button onClick={() => setCurrentTool('text')} className={`p-2 rounded ${currentTool === 'text' ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100'}`} title="Text">🔤</button>
              <button onClick={() => setCurrentTool('eraser')} className={`p-2 rounded ${currentTool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100'}`} title="Eraser">🧹</button>
            </div>

            {/* Colors */}
            <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={`w-8 h-8 rounded border-2 transition-all ${currentColor === color ? 'border-blue-600 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Stroke Width */}
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 shadow-sm">
              <span className="text-sm text-slate-600">Size:</span>
              <input type="range" min="1" max="10" value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} className="w-24" />
              <span className="text-sm font-semibold text-slate-900">{strokeWidth}</span>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="p-6 flex items-center justify-center bg-slate-50">
          <canvas
            ref={canvasRef}
            width={1000}
            height={600}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="border-2 border-slate-300 rounded-lg bg-white cursor-crosshair shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};
