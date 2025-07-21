import Image from "next/image";
import NavbarPaciente from "../NavBar";

export default function PerfilPaciente() {
    return(
        <main className="min-h-screen bg-white">
              <NavbarPaciente />
        
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
            <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
                <Image
                src="/logo_sanare.jpg"
                alt="Avatar"
                layout="fill"
                className="rounded-full object-cover border-4"
                />
            </div>
            <p className="text-gray-700 font-medium text-sm mb-1">
                usuario234@gmail.com
            </p>
            <hr className="w-full border-t my-4" />
            <div className="flex gap-4 mb-6">
                <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition"
                >
                Editar
                </button>
                <button
                
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow transition"
                >
                Guardar
                </button>
            </div>
            <div className="w-full space-y-4">
                <input
                type="text"
                name="nombre"
                placeholder="Nombre"
            
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                />
                <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                />
                <input
                type="text"
                name="ciudad"
                placeholder="Ciudad"
                
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                />
            </div>
            </div>
        </div>
        </div>
    </main>
  );
}