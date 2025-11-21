// src/app/layout.js
'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { MdApps } from 'react-icons/md';
import { BiSolidCoinStack } from 'react-icons/bi';
import { HiUsers } from 'react-icons/hi';
import { RiCompassFill } from 'react-icons/ri';
import { FaUser, FaCoffee } from 'react-icons/fa';
import { GoBellFill } from 'react-icons/go';
import { PiTerminalWindowDuotone } from 'react-icons/pi';
import { usePathname } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const LeftNavBackdrop = () => (
  <svg width="320" height="63" viewBox="0 0 320 63" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 -z-10">
    <g filter="url(#filter0_d_16_49)">
      <rect x="17" width="320" height="55" rx="8" fill="#1F1F1F" shapeRendering="crispEdges"/>
    </g>
    <defs>
      <filter id="filter0_d_16_49" x="13" y="0" width="328" height="63" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="2"/>
        <feOffset dy="4"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="SourceGraphic" result="shape"/>
      </filter>
    </defs>
  </svg>
);

const RightNavBackdrop = () => (
  <svg width="320" height="63" viewBox="0 0 320 63" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 -z-10 right-0">
    <g filter="url(#filter1_d_16_49)">
      <rect x="17" width="320" height="55" rx="8" fill="#1F1F1F" shapeRendering="crispEdges"/>
    </g>
    <defs>
      <filter id="filter1_d_16_49" x="13" y="0" width="328" height="63" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="2"/>
        <feOffset dy="4"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="SourceGraphic" result="shape"/>
      </filter>
    </defs>
  </svg>
);

export default function RootLayout({ children }) {
  const iconColor = '#A0A0A0';
  const iconSize = 24;
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .material-symbols-rounded, .material-symbols-outlined {
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                line-height: 1;
                display: inline-block;
              }
            `,
          }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {pathname === '/' && (
          <header className="fixed left-1/2 top-[39px] z-30 flex h-[55px] w-full md:w-[1394px] max-w-[calc(100vw-34px)] -translate-x-1/2 items-center justify-between px-3 md:px-[12px] hidden md:flex pointer-events-none">
            <div className="hidden md:block relative h-[55px] w-[320px] transition-all duration-300 ease-out rounded-lg group">
              <LeftNavBackdrop />
              <div className="absolute inset-0 flex items-center justify-between px-[25px] [&>span]:transition-all [&>span]:duration-300 [&>span]:ease-out">
                <Link href="/dashboard" className="inline-flex h-[24px] w-[24px] items-center justify-center self-center transition-all duration-300 ease-out rounded-full pointer-events-auto">
                  <MdApps size={iconSize} color={iconColor} />
                </Link>
                <Link href="/profile" className="inline-flex h-[24px] w-[24px] items-center justify-center self-center transition-all duration-300 ease-out rounded-full pointer-events-auto">
                  <FaUser size={iconSize} color={iconColor} />
                </Link>
                <Link href="/connections" className="inline-flex h-[24px] w-[24px] items-center justify-center self-center transition-all duration-300 ease-out rounded-full pointer-events-auto">
                  <HiUsers size={iconSize} color={iconColor} />
                </Link>
                <Link href="/explore" className="inline-flex h-[24px] w-[24px] items-center justify-center self-center transition-all duration-300 ease-out rounded-full pointer-events-auto">
                  <RiCompassFill size={iconSize} color={iconColor} />
                </Link>
                <Link href="/workspace" className="inline-flex h-[24px] w-[24px] items-center justify-center self-center transition-all duration-300 ease-out rounded-full pointer-events-auto">
                  <PiTerminalWindowDuotone size={iconSize} color={iconColor} />
                </Link>
              </div>
            </div>

            <div className="hidden md:block relative h-[55px] w-[320px] transition-all duration-300 ease-out rounded-lg group">
              <RightNavBackdrop />
              <div className="absolute inset-0 flex items-center justify-between px-[25px] [&>div]:transition-all [&>div]:duration-300 [&>div]:ease-out">
                <div className="relative flex items-center justify-center h-[24px] w-[24px] self-center transition-all duration-300 ease-out pointer-events-auto">
                  <BiSolidCoinStack size={iconSize} color="#FFD700" />
                  <span className="absolute -right-4 top-0 text-[23px] font-extrabold leading-[23px] transition-all duration-300 ease-out">1</span>
                </div>
                <div className="flex items-center justify-center h-[24px] w-[24px] self-center transition-all duration-300 ease-out rounded-full pointer-events-auto">
                  <FaCoffee size={iconSize} color={iconColor} />
                </div>
                <div className="flex items-center justify-center h-[24px] w-[24px] self-center transition-all duration-300 ease-out rounded-full pointer-events-auto">
                  <GoBellFill size={iconSize} color={iconColor} />
                </div>
                <span className="inline-flex h-[24px] w-[24px] items-center justify-center self-center transition-all duration-300 ease-out rounded-full pointer-events-auto">
                  <FaUser size={iconSize} color={iconColor} />
                </span>
              </div>
            </div>
          </header>
        )}

        {pathname === '/' && (
          <div className="md:hidden fixed top-4 left-2 right-2 z-30 bg-[#1F1F1F] rounded-lg px-4 py-4 shadow-[0_6px_20px_rgba(0,0,0,0.85)] pointer-events-none">
            <div className="flex flex-row items-center justify-between">
              <div className="relative flex items-center justify-center h-[24px] w-[24px] cursor-pointer self-center transition-all duration-300 ease-out rounded-full pointer-events-auto">
                <BiSolidCoinStack size={iconSize} color="#FFD700" />
                <span className="absolute -right-3 top-0 text-[24px] font-extrabold leading-[24px]">1</span>
              </div>
              <div className="flex items-center justify-center h-[24px] w-[24px] cursor-pointer self-center transition-all duration-300 ease-out rounded-full pointer-events-auto">
                <FaCoffee size={iconSize} color={iconColor} />
              </div>
              <div className="flex items-center justify-center h-[24px] w-[24px] cursor-pointer self-center transition-all duration-300 ease-out rounded-full pointer-events-auto">
                <GoBellFill size={iconSize} color={iconColor} />
              </div>
              <span className="inline-flex h-[24px] w-[24px] items-center justify-center cursor-pointer self-center transition-all duration-300 ease-out rounded-full pointer-events-auto">
                <FaUser size={iconSize} color={iconColor} />
              </span>
            </div>
          </div>
        )}

        {pathname === '/' && (
          <nav className="md:hidden fixed bottom-2 left-2 right-2 z-30 bg-[#1F1F1F] rounded-lg px-4 py-4 shadow-[0_6px_20px_rgba(0,0,0,0.85)] pointer-events-none">
            <div className="flex flex-row items-center justify-between">
              <Link href="/dashboard" className="inline-flex h-[24px] w-[24px] items-center justify-center self-center cursor-pointer transition-all duration-300 ease-out rounded-full pointer-events-auto">
                <MdApps size={iconSize} color={iconColor} />
              </Link>
              <Link href="/profile" className="inline-flex h-[24px] w-[24px] items-center justify-center self-center cursor-pointer transition-all duration-300 ease-out rounded-full pointer-events-auto">
                <FaUser size={iconSize} color={iconColor} />
              </Link>
              <Link href="/connections" className="inline-flex h-[24px] w-[24px] items-center justify-center self-center cursor-pointer transition-all duration-300 ease-out rounded-full pointer-events-auto">
                <HiUsers size={iconSize} color={iconColor} />
              </Link>
              <Link href="/explore" className="inline-flex h-[24px] w-[24px] items-center justify-center self-center cursor-pointer transition-all duration-300 ease-out rounded-full pointer-events-auto">
                <RiCompassFill size={iconSize} color={iconColor} />
              </Link>
              <Link href="/workspace" className="inline-flex h-[24px] w-[24px] items-center justify-center self-center cursor-pointer transition-all duration-300 ease-out rounded-full pointer-events-auto">
                <PiTerminalWindowDuotone size={iconSize} color={iconColor} />
              </Link>
            </div>
          </nav>
        )}

        {children}
      </body>
    </html>
  );
}
