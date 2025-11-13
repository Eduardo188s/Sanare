"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaUserMd, FaBell, FaQuestionCircle } from "react-icons/fa";

export default function SideBarMedico({ hayNuevas }: { hayNuevas?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 shadow-sm flex flex-col py-8 z-20">
      <nav className="flex flex-col mt-2 space-y-2 px-4">

        <Link
          href="/medico"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
            pathname === "/medico"
              ? "bg-blue-50 text-[#6381A8] font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          }`}
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
        >
          <FaUserMd className="w-4 h-4" /> Perfil
        </Link>
      </nav>
      <div className="px-4 mt-auto border-t border-gray-200 pt-4">
        <Link
          href="/paciente/soporte"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
            pathname.includes("/soporte")
              ? "bg-blue-50 text-[#6381A8] font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FaQuestionCircle className="w-4 h-4" /> Ayuda y soporte
        </Link>
      </div>
    </aside>
  );
}
