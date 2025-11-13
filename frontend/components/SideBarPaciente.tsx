"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCalendarAlt, FaHome, FaQuestionCircle, FaUser } from "react-icons/fa";

export default function SidebarPaciente() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 shadow-sm flex flex-col py-8 z-20">
      <nav className="flex flex-col mt-2 space-y-2 px-4">
        <Link
          href="/paciente"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
            pathname === "/paciente"
              ? "bg-blue-50 text-[#6381A8] font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FaHome className="w-4 h-4" /> Inicio
        </Link>

        <Link
          href="/paciente/citas"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
            pathname.includes("/citas")
              ? "bg-blue-50 text-[#6381A8] font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FaCalendarAlt className="w-4 h-4" /> Mis citas
        </Link>

        <Link
          href="/paciente/perfil"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
            pathname.includes("/perfil")
              ? "bg-blue-50 text-[#6381A8] font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FaUser className="w-4 h-4" /> Perfil
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
