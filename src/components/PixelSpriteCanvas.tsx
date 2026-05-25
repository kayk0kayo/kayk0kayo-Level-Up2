import React, { useEffect, useRef, useState } from 'react';

interface PixelSpriteCanvasProps {
  spritesheetUrl: string;
  frameWidth: number;   // Largura real de cada frame na spritesheet (ex: 64)
  frameHeight: number;  // Altura real de cada frame (ex: 64)
  maxFramesX: number;   // Quantidade de frames na horizontal (ex: 6)
  stateFrameY?: number; // Linha da spritesheet correspondente ao estado (ex: idle=0, hit=1)
  animationSpeed?: number; // Tempo de cada frame em milissegundos
  className?: string;
  scale?: number; // Escala de renderização no canvas
}

export function PixelSpriteCanvas({
  spritesheetUrl,
  frameWidth,
  frameHeight,
  maxFramesX,
  stateFrameY = 0,
  animationSpeed = 150, // default 150ms por frame
  className = "",
  scale = 2
}: PixelSpriteCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  // Controle de estado e animação
  const [frameX, setFrameX] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);

  // 1. & 2. CARREGAMENTO SEGURO DA SPRITE
  useEffect(() => {
    const img = new Image();
    img.src = spritesheetUrl;
    
    img.onload = () => {
      setImageLoaded(true);
      imageRef.current = img;
    };

    img.onerror = () => {
      setError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [spritesheetUrl]);

  // RESET do frameX ao mudar de stateFrameY (ex: idle -> attack) para evitar ler frame inexistente
  useEffect(() => {
    setFrameX(0);
  }, [stateFrameY]);

  // 4. CONTROLO DE VELOCIDADE DA ANIMAÇÃO (FRAME RATE via Delta Time Simulation com useEffect / requestAnimationFrame)
  useEffect(() => {
    if (!imageLoaded) return;

    let lastTime = 0;
    let animationFrameId: number;

    const renderLoop = (time: number) => {
      if (lastTime === 0) lastTime = time;
      const deltaTime = time - lastTime;

      if (deltaTime >= animationSpeed) {
        setFrameX((prevFrame) => (prevFrame + 1) % maxFramesX);
        lastTime = time;
      }
      
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [imageLoaded, maxFramesX, animationSpeed]);

  // 1. & 3. RENDERIZAÇÃO DE PIXEL ART E LÓGICA DE RECORTE (ctx.drawImage de 9 parâmetros)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded || !imageRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Desativar a suavização de imagem para preservar Pixel Art
    ctx.imageSmoothingEnabled = false;
    (ctx as any).mozImageSmoothingEnabled = false;
    (ctx as any).webkitImageSmoothingEnabled = false;
    (ctx as any).msImageSmoothingEnabled = false;

    // Limpar o frame anterior antes de desenhar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const image = imageRef.current;
    
    // Variáveis dinâmicas para a posição de origem (sx, sy) na spritesheet
    const sx = frameX * frameWidth;
    const sy = stateFrameY * frameHeight;
    const sWidth = frameWidth;
    const sHeight = frameHeight;

    // Posição de destino no canvas
    const dx = 0;
    const dy = 0;
    const dWidth = frameWidth * scale; // Largura redimensionada
    const dHeight = frameHeight * scale; // Altura redimensionada

    // Função de 9 parâmetros - recorte perfeito e redimensionamento nativo do canvas
    ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    
  }, [frameX, stateFrameY, imageLoaded, frameWidth, frameHeight, scale]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Texto de aviso se o utilizador ainda não adicionou a imagem */}
      {!imageLoaded && !error && (
         <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-red-500/50 p-2 text-[10px] text-center text-red-300 font-pixel-mono">
           Carregando<br/>Spritesheet...
         </div>
      )}
      {error && (
         <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-red-500/50 p-2 text-[8px] text-center text-red-500 font-pixel-mono uppercase">
           [Adicione "/zombie_sprite.png"]<br/>nas dimensões exatas na pasta /public
         </div>
      )}
      
      <canvas
        ref={canvasRef}
        width={frameWidth * scale}
        height={frameHeight * scale}
        // Aplica via CSS também a renderização pixel art, como reforço
        className="pixel-art drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] bg-transparent"
      />
    </div>
  );
}
