'use client'

import { useState } from 'react';

interface HeaderProps {
  onHomeClick?: () => void;
  onLoginClick: () => void;
  onRegisterClick?: () => void;
}

export function Header({ onHomeClick, onLoginClick, onRegisterClick}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isRolPage = false; 
  if (isRolPage) return null;

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
      <nav className="flex items-center justify-between bg-[#ffffff] p-4 border-gray-200 sticky top-0 z-50 w-full">
        {/* Logo */}
        <div className="flex items-center space-x-2 gap-3 select-none">
          <img 
            src="/icons/logo_sanare.jpg" 
            alt="Logo Sanare"
            width={60}
            height={50}
            className="h-10 w-10 rounded-full object-cover cursor-pointer transform scale-150 hover:scale-170 transition-transform duration-300"
            onClick={onHomeClick}
          />
          <div className="flex flex-col">
            <span className="font-bold text-xl text-[#6381A8]">Sanare</span>
            <span className="text-xs text-[#6381A8]">Directorio de clínicas</span>
          </div>        
        </div>

        {/* Botones / Menú móvil */}
        <div className="flex items-center">
          {/* Botones escritorio */}
          <div className="hidden md:flex gap-4">
            <button
              onClick={onLoginClick}
              className="bg-[#6381A8] hover:bg-[#4f6a8f] text-white font-bold py-2 px-6 rounded-full transition-colors duration-300"
            >
              Iniciar sesión
            </button>
            <button
              onClick={onRegisterClick}
              className="bg-transparent border border-[#6381A8] text-[#6381A8] font-bold py-2 px-6 rounded-full hover:bg-[#4f6a8f] hover:text-white transition-colors duration-300"
            >
              Registrarse
            </button>
          </div>

          {/* Botón hamburguesa móvil */}
          <div className="md:hidden">
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
            >
              <span className={`block w-6 h-0.5 bg-[#6381A8] mb-1 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-[#6381A8] mb-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-[#6381A8] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Menú desplegable móvil */}
      {menuOpen && (
        <div className="md:hidden bg-white w-full shadow-md flex flex-col items-center py-4 gap-4 border-t border-gray-200">
          <button
            onClick={() => { onLoginClick(); setMenuOpen(false); }}
            className="bg-[#6381A8] hover:bg-[#4f6a8f] text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 w-3/4"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => { onRegisterClick?.(); setMenuOpen(false); }}
            className="bg-transparent border border-[#6381A8] text-[#6381A8] font-bold py-2 px-6 rounded-full hover:bg-[#4f6a8f] hover:text-white transition-colors duration-300 w-3/4"
          >
            Registrarse
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
