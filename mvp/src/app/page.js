'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdChevronRight } from 'react-icons/md';
import { BsStars } from 'react-icons/bs';
import { RiLightbulbFlashFill } from 'react-icons/ri';
import { useAuth } from './hooks/useAuth';  // Add this import

/**
 * Animated Squares background from React Bits (JS/TS + CSS variant).
 */
const Squares = ({
  direction = 'right',
  speed = 1,
  borderColor = '#999',
  squareSize = 40,
  hoverFillColor = '#222',
  className = ''
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const numSquaresX = useRef();
  const numSquaresY = useRef();
  const gridOffset = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.style.pointerEvents = 'auto';

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      let hoveredX = null;
      let hoveredY = null;
      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      if (mx !== null && my !== null && mx >= 0 && mx <= canvas.width && my >= 0 && my <= canvas.height) {
        hoveredX = Math.floor((mx + gridOffset.current.x - startX) / squareSize);
        hoveredY = Math.floor((my + gridOffset.current.y - startY) / squareSize);
      }

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          const gridX = Math.floor((x - startX) / squareSize);
          const gridY = Math.floor((y - startY) / squareSize);
          if (hoveredX !== null && hoveredY !== null && gridX === hoveredX && gridY === hoveredY) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);
      switch (direction) {
        case 'right':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case 'left':
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case 'up':
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case 'down':
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case 'diagonal':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        default:
          break;
      }

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = event => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current.x = event.clientX - rect.left;
      mousePos.current.y = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mousePos.current.x = null;
      mousePos.current.y = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [direction, speed, borderColor, squareSize, hoverFillColor]);

  return <canvas ref={canvasRef} className={`squares-canvas ${className}`} />;
};

/**
 * Main Home/Landing page component - PUBLIC ACCESS (no redirect on unauth)
 */
export default function Home() {
  const [inputHeight, setInputHeight] = useState('h-[72px]');
  const { user, loading } = useAuth(false);  // Use hook with public access (no redirect)
  const router = useRouter();

  // Show loading while checking auth (minimal)
  if (loading) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  // Render for all users - no redirect
  return (
    <div className="relative w-screen h-dvh bg-black">
      <Squares 
        speed={0.2} 
        squareSize={25}
        direction="diagonal"
        borderColor="#1f1f24"
        hoverFillColor="#111"
        className="fixed inset-0 z-0"
      />

      <div className="pointer-events-none absolute inset-0 bg-white/8 z-10" />

      <div className="relative flex flex-col w-screen h-dvh">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(25,25,25,0)_0%,#191919_82.69%)] z-20" />
        
        <section className="flex-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-2 sm:px-4 max-w-4xl mx-auto pt-20 md:pt-0 z-40">
          <div className="w-full">
            {/* Conditional greeting: personalized if logged in, generic otherwise */}
            <h1 className="mb-5 text-center [font-family:Mako,sans-serif] text-[32px] sm:text-[40px] font-[400] leading-[42px] sm:leading-[52px] text-white transition-all duration-300 ease-out">
              {user ? `Hey! ${user.name}.` : 'Welcome to OpenTab!'}
            </h1>

            <div 
              className={`
                flex items-center justify-between gap-[22px] rounded-[10px] 
                bg-[#1F1F1F] px-[28px] py-[11px] shadow-[0_6px_20px_rgba(0,0,0,0.45)]
                transition-all duration-300 ease-out 
                focus-within:scale-[1.02] focus-within:bg-[#2A2A2A]
                focus-within:shadow-[0_8px_25px_rgba(0,0,0,0.55)]
                hover:shadow-[0_8px_25px_rgba(0,0,0,0.55)]
              `}
              style={{ height: inputHeight === 'h-[100px]' ? '100px' : '72px' }}
            >
              <input
                type="text"
                placeholder={user ? "Create a New Workspace With an Idea ... !" : "Login to create workspaces..."}
                className="flex-1 h-[31px] bg-transparent text-[20px] sm:text-[24px] leading-[31px] text-white/45 [font-family:Mako,sans-serif] outline-none px-2 transition-all duration-300 ease-out focus:text-white/80"
                onFocus={!user ? undefined : () => setInputHeight('h-[100px]')}  // Disable focus change if not user
                onBlur={!user ? undefined : () => setInputHeight('h-[72px]')}   // Disable focus change if not user
                disabled={!user}  // Disable input if not logged in
              />
              <span 
                className="grid h-6 w-6 place-items-center rounded-full border border-[#0C8CE9] transition-all duration-300 ease-out hover:scale-125 hover:bg-[#0C8CE9]/30 active:scale-95 cursor-pointer"
                onClick={!user ? () => router.push('/login') : undefined}  // Redirect to login if not user
              >
                <MdChevronRight
                  size={22}
                  color="#0C8CE9"
                  strokeWidth={2}
                  className="transition-all duration-300 ease-out"
                />
              </span>
            </div>

            <div className={`transition-all duration-300 ${inputHeight === 'h-[100px]' ? 'mt-8' : 'mt-5'} flex w-full flex-col gap-4 md:flex-row md:gap-8`}>
              <button 
                className="flex w-full md:w-1/2 items-center gap-[25px] rounded-[10px] bg-[#1F1F1F] px-[30px] py-[20px] text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:scale-[1.03] hover:bg-[#2A2A2A] hover:shadow-[0_6px_8px_rgba(0,0,0,0.35)] active:scale-[0.98] group"
                onClick={!user ? () => router.push('/login') : undefined}  // Redirect to login if not user
                disabled={!user}  // Disable button if not logged in
              >
                <span className="grid h-[31px] w-[24px] place-items-center text-[#0C8CE9] transition-all duration-300 ease-out group-hover:text-blue-400">
                  <RiLightbulbFlashFill size={24} color="#0C8CE9" />
                </span>
                <span className="flex items-center text-[20px] sm:text-[24px] leading-[31px] [font-family:Mako,sans-serif] transition-all duration-300 ease-out hover:text-blue-200">
                  {user ? 'Bounce Your Idea' : 'Login to Continue'}
                </span>
              </button>
              <button 
                className="flex w-full md:w-1/2 items-center gap-[25px] rounded-[10px] bg-[#1F1F1F] px-[30px] py-[21px] text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:scale-[1.03] hover:bg-[#2A2A2A] hover:shadow-[0_6px_8px_rgba(0,0,0,0.35)] active:scale-[0.98] group"
                onClick={!user ? () => router.push('/login') : undefined}  // Redirect to login if not user
                disabled={!user}  // Disable button if not logged in
              >
                <span className="grid h-[31px] w-[28px] place-items-center text-[#0C8CE9] transition-all duration-300 ease-out group-hover:text-blue-400">
                  <BsStars size={24} color="#0C8CE9" />
                </span>
                <span className="flex items-center text-[20px] sm:text-[24px] leading-[31px] [font-family:Mako,sans-serif] transition-all duration-300 ease-out hover:text-blue-200">
                  {user ? 'Find Your Tribe' : 'Login to Continue'}
                </span>
              </button>
            </div>
          </div>
        </section>

        <footer className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[20px] sm:text-[24px] leading-[25px] [font-family:Consolas,monospace] text-white/40 transition-all duration-300 ease-out md:pb-16 pb-16 md:pb-0 z-40">
          <span className="block w-[396px] max-w-full text-center px-4">
            An OpenTab Innovations Production
          </span>
        </footer>
      </div>

      <style jsx global>{`
        .squares-canvas {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
      `}</style>
    </div>
  );
}
