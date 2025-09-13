'use client'

import Link from "next/link"
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const isRolPage = pathname.startsWith("/medico") || pathname.startsWith("/paciente");

  if (isRolPage) return null;

  return (
    <header className="w-1/2 bg-[#6381A8] text-white py-8 px-6 shadow-md ml-auto">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold"></div>
        <div className="flex gap-4 text-sm ">
          <Link href="/" className={`rounded-3xl px-5 py-2 text-base font-medium ${
            pathname === '/' ? 'bg-white text-black font-bold' : 'text-white hover:bg-white hover:text-black'}`}>Home</Link>
          
          <Link href="/about" className={`rounded-3xl px-5 py-2 text-base font-medium ${
            pathname === '/about' ? 'bg-white text-black font-bold' : 'text-white hover:bg-white hover:text-black'}`}>Sobre nosotros</Link>
          
          <Link href="/login" className={`rounded-3xl px-5 py-2 text-base font-medium ${
            pathname === '/login' ? 'bg-white text-black font-bold' : 'text-white hover:bg-white hover:text-black'}`}>Iniciar sesión</Link>
          
          <Link href="/register" className={`rounded-3xl px-5 py-2 text-base font-medium ${
            pathname === '/register' ? 'bg-white text-black font-bold' : 'text-white hover:bg-white hover:text-black'}`}>Registrarse</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
