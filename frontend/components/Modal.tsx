'use client';
import React from "react";
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

type Props = {
  open: boolean;
  type?: "success" | "error" | "warning";
  message: string;
  onClose: () => void;
};

export default function Modal({ open, type = "success", message, onClose }: Props) {
  if (!open) return null;

  const colors = {
    success: "#4caf50",
    error: "#e53935",
    warning: "#fbc02d",
  };

  const Icon = {
    success: <FaCheckCircle size={40} color={colors.success} />,
    error: <FaTimesCircle size={40} color={colors.error} />,
    warning: <FaExclamationTriangle size={40} color={colors.warning} />,
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-9999">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm animate-fadeIn">
        <div className="flex flex-col items-center text-center">
          {Icon[type]}

          <p className="text-lg font-medium mt-3 text-gray-800">{message}</p>

          <button
            onClick={onClose}
            className="mt-5 bg-[#6381A8] hover:bg-[#4f6a8f] text-white px-5 py-2 rounded-xl shadow transition-all"
          >
            Aceptar
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}
