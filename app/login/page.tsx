import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 flex items-center justify-center bg-white p-8">
        <div className="text-center">
          <Image
            src="/logo_sanare.jpg"
            alt="Logo Sanare"
            width={600}
            height={600}
            className="rounded-lg max-w-full h-auto"
            priority
          />
        </div>
      </div>

      <div className="w-1/2 bg-[#6381A8] p-8 flex flex-col">
        <div className="flex-grow flex flex-col items-center justify-center text-center p-12 text-white shadow-2xl">
          <h1 className="text-5xl font-light mb-8">Bienvenido</h1>

          <div className="bg-white rounded-lg p-8 w-full max-w-md text-black">
            <h2 className="text-2xl font-semibold mb-6 text-center">Inicia Sesión</h2>
            <form>
              <div className="mb-4">
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6381A8]"
                  placeholder="Correo Electrónico"
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6381A8]"
                  placeholder="Contraseña"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#6381A8] text-white py-2 px-4 rounded hover:bg-[#4f6a8f] transition duration-200"
              >
                Iniciar
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Inicia sesión con una cuenta antes ya registrada
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-6 p-4">
        </div>
      </div>
    </div>
  );
}