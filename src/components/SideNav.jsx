import React from 'react';

export default function SideNav({ onLogoClick, activeTab, setActiveTab, onOpenNfcModal, onOpenAddMember }) {
  return (
    <>
      {/* SideNavBar (Desktop) */}
      <nav className="hidden lg:flex flex-col py-8 px-6 gap-unit fixed left-0 top-0 h-full w-72 bg-surface-container-lowest/80 backdrop-blur-[60px] border-r border-white/10 shadow-[40px_0_80px_rgba(0,0,0,0.6)] z-40">
        <div className="mb-12 px-2">
          <div 
            className="flex items-center gap-4 mb-8 cursor-pointer hover:scale-105 transition-transform"
            onClick={onLogoClick}
          >
            <img 
              className="w-12 h-12 rounded-xl object-cover glass-container p-1" 
              alt="Logo" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiK63-FWMtejS90sRiGW7migUgteUYy5nWQUOVPduqPtguMhgkbsColNEsE5uAxfpQDCN6Og_teuAoxYFcHjIiMLrkwBebU9I6ycYA8mGFMNbJ2-Ax_2g82Xd6k9rKjdZjpluE4pBjYcapFAereWsem_A-8ougec8jKjMlLi_auaUSPZPryV8FYbnfbQ1yO4sRuxxg6a_sZa3kZu2kwEEYSy9QUm_XwR1y3UjgXJSzckUP5JsfKN3V"
            />
            <div>
              <h1 className="font-display-lg text-[24px] tracking-tighter text-secondary-fixed font-bold">IEDC PORTAL</h1>
            </div>
          </div>
          <button 
            className="w-full py-4 rounded-xl btn-gradient text-on-primary-fixed font-headline-xl text-lg glow-active hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
            onClick={onOpenAddMember}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
            New Entry
          </button>
        </div>
        
        <div className="flex-1 flex flex-col gap-2 font-label-mono text-label-mono">
          <button 
            className={`flex items-center gap-4 px-4 py-3 rounded-lg duration-200 ${activeTab === 'dashboard' ? 'bg-secondary-container/10 text-secondary-fixed border-l-4 border-secondary-fixed shadow-[inset_0_0_15px_rgba(0,244,254,0.2)] translate-x-1' : 'text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-variant/20 hover:text-primary transition-all'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="material-symbols-outlined">dashboard</span>
            Overview
          </button>
          
          <button 
            className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-variant/20 hover:text-primary transition-all duration-300"
            onClick={() => alert('Live Feed module not implemented yet.')}
          >
            <span className="material-symbols-outlined">sensors</span>
            Live Feed
          </button>
          
          <button 
            className={`flex items-center gap-4 px-4 py-3 rounded-lg duration-200 ${activeTab === 'directory' ? 'bg-secondary-container/10 text-secondary-fixed border-l-4 border-secondary-fixed shadow-[inset_0_0_15px_rgba(0,244,254,0.2)] translate-x-1' : 'text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-variant/20 hover:text-primary transition-all'}`}
            onClick={() => setActiveTab('directory')}
          >
            <span className="material-symbols-outlined">group</span>
            Member Directory
          </button>
          
          <button 
            className={`flex items-center gap-4 px-4 py-3 rounded-lg duration-200 ${activeTab === 'history' ? 'bg-secondary-container/10 text-secondary-fixed border-l-4 border-secondary-fixed shadow-[inset_0_0_15px_rgba(0,244,254,0.2)] translate-x-1' : 'text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-variant/20 hover:text-primary transition-all'}`}
            onClick={() => setActiveTab('history')}
          >
            <span className="material-symbols-outlined">history</span>
            Access Logs
          </button>

          <button 
            className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-variant/20 hover:text-primary transition-all duration-300"
            onClick={onOpenNfcModal}
          >
            <span className="material-symbols-outlined">contactless</span>
            NFC Terminal
          </button>
        </div>
        
        <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-2 font-label-mono text-label-mono">
          <a className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-variant/20 hover:text-primary transition-all duration-300" href="#">
            <span className="material-symbols-outlined">help</span>
            Support
          </a>
          <a className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-variant/20 hover:text-primary transition-all duration-300" href="#">
            <span className="material-symbols-outlined">memory</span>
            System Status
          </a>
        </div>
      </nav>

      {/* TopNavBar (Mobile / Alternative Navigation) */}
      <nav className="lg:hidden fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile h-24 bg-surface/5 backdrop-blur-[40px] border-b border-white/20 shadow-[0_0_20px_rgba(0,245,255,0.1)]">
        <div 
          className="font-display-lg text-[24px] bg-gradient-to-r from-secondary-fixed to-primary-fixed bg-clip-text text-transparent tracking-tighter cursor-pointer"
          onClick={onLogoClick}
        >
          IEDC PORTAL
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:text-secondary-fixed transition-all"><span className="material-symbols-outlined">search</span></button>
          <button className="text-on-surface-variant hover:text-secondary-fixed transition-all"><span className="material-symbols-outlined">menu</span></button>
        </div>
      </nav>
    </>
  );
}
