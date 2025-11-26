"use client";

import React from "react";
import { FaQuestionCircle } from "react-icons/fa";

type Props = {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ open, message, onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-9999">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm animate-fadeIn">
        
        <div className="flex flex-col items-center text-center">
          <FaQuestionCircle size={48} className="text-[#6381A8]" />

          <p className="text-lg font-medium mt-3 text-gray-800">
            {message}
          </p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
            >
              No
            </button>

            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-xl bg-[#6381A8] hover:bg-[#4f6a8f] text-white transition shadow"
            >
              Sí
            </button>
          </div>
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
