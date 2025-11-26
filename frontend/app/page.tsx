'use client'

import Header from '@/components/Header';
import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleShowLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowHome = () => {
    setShowLogin(false);
    setShowRegister(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        onHomeClick={handleShowHome}
        onLoginClick={handleShowLogin}
        onRegisterClick={handleShowRegister}
      />

      <div
        className="relative flex flex-col items-center justify-center min-h-screen text-center p-8 pt-20"
        style={{
          backgroundImage: "url('/medicos_operando.jpg')",
          backgroundSize: '100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          transition: 'background-size 0.5s ease-in-out',
        }}
      >
        <div className="absolute inset-0 bg-[#6381A8] opacity-70"></div>
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Directorio de clínicas y consultorios médicos
          </h1>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-12">
            Encuentra el especialista ideal para ti
          </h2>

          <div className="flex items-center justify-center min-h-[400px] transition-all duration-500">
            {showLogin ? (
              <LoginForm />
            ) : showRegister ? (
              <RegisterForm />
            ) : (
              <img
                src="/icons/logo_sanare.jpg"
                alt="Logo Sanare"
                width={300}
                height={100}
                className="max-w-[300px] h-auto rounded-3xl cursor-pointer"
              />
            )}
          </div>

          <p className="max-w-4xl text-lg text-white mt-12 px-4">
            Sanare ha sido diseñada para hacer tu experiencia médica más simple, rápida y organizada.
            Desde esta plataforma podrás agendar tus citas, recibir recordatorios, consultar tu historial
            y encontrar el profesional de salud adecuado para ti. Nos comprometemos a brindarte una
            herramienta segura y accesible.
          </p>
        </div>
      </div>

      {/* Especialidades */}
      <div className="w-full bg-[#ffffff] text-[#6381A8] py-16 px-4 flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl font-bold mb-12">
          Contamos con una amplia gama de especialidades
        </h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {[
            'Angiología', 'Traumatología', 'Ginecología', 'Cardiología',
            'Pediatría', 'Medicina Interna', 'Nutrición', 'Odontología',
            'Dermatología', 'Psicología', 'Neurología', 'Oftalmología',
            'Endocrinología', 'Fisioterapia'
          ].map((especialidad) => (
            <span
              key={especialidad}
              className="cursor-pointer border border-[#6381A8] rounded-full py-2 px-6 transition-transform duration-300 hover:scale-110 hover:shadow-lg"
            >
              {especialidad}
            </span>
          ))}
        </div>
      </div>

      {/* Sección contacto */}
      <div className="w-full bg-[#6381A8] text-white flex flex-col items-center text-center py-16 px-4">
        <div className="relative w-full max-w-4xl mx-auto mb-12">
          <div
            className="w-full h-64 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: "url('/image_cirugia.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-[#ffffff] rounded-lg flex flex-col justify-center items-center p-8">
            <button className="bg-[#6281A8] text-[#ffffff] font-bold py-3 px-6 rounded-full mb-8">
              Contáctanos →
            </button>
            <p className="text-gray-600 text-xl leading-relaxed max-w-2xl">
              Nuestra misión es simplificar el acceso a la atención médica de calidad. Con <b>Sanare</b>,
              conectamos a pacientes con un directorio de especialistas, haciendo que tu salud sea más fácil de gestionar.
            </p>
          </div>
        </div>

        <div className="w-full border-t border-white mt-8 pt-4 text-center text-sm text-white">
          <p>© 2025 Sanare. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
