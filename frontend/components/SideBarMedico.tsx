'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaUserMd, FaBell, FaQuestionCircle } from "react-icons/fa";
import { FiX } from "react-icons/fi";

interface Props {
  hayNuevas?: boolean;
  abierto?: boolean;
  cerrarDrawer?: () => void;
}

export default function SideBarMedico({ hayNuevas, abierto = false, cerrarDrawer }: Props) {
  const pathname = usePathname();

  const MenuItems = () => (
    <>
      <Link
        href="/medico"
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
          pathname === "/medico"
            ? "bg-blue-50 text-[#6381A8] font-semibold"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        onClick={cerrarDrawer}
      >
        <FaHome className="w-4 h-4" /> Inicio
      </Link>

      <Link
        href="/medico/notificaciones"
        className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
          pathname.includes("/notificaciones")
            ? "bg-blue-50 text-[#6381A8] font-semibold"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        onClick={cerrarDrawer}
      >
        <div className="relative">
          <FaBell className="w-4 h-4" />
          {hayNuevas && !pathname.includes("/notificaciones") && (
            <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          )}
        </div>
        Notificaciones
      </Link>

      <Link
        href="/medico/perfil"
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
          pathname.includes("/perfil")
            ? "bg-blue-50 text-[#6381A8] font-semibold"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        onClick={cerrarDrawer}
      >
        <FaUserMd className="w-4 h-4" /> Perfil
      </Link>

      <div className="mt-auto border-t border-gray-200 pt-4">
        <Link
          href="/paciente/soporte"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
            pathname.includes("/soporte")
              ? "bg-blue-50 text-[#6381A8] font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={cerrarDrawer}
        >
          <FaQuestionCircle className="w-4 h-4" /> Ayuda y soporte
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Sidebar escritorio */}
      <aside className="hidden md:flex fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 shadow-sm flex-col py-8 z-20">
        <nav className="flex flex-col mt-2 space-y-2 px-4">
          <MenuItems />
        </nav>
      </aside>

      {/* Drawer móvil */}
      {abierto && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-4 md:hidden flex flex-col">
          <button
            className="self-end mb-4 p-2 text-gray-700 rounded hover:bg-gray-100"
            onClick={cerrarDrawer}
          >
            <FiX size={20} />
          </button>
          <nav className="flex flex-col mt-2 space-y-2">
            <MenuItems />
          </nav>
        </div>
      )}
    </>
  );
}
