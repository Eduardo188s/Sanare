import React from "react";
import Image from "next/image";

export default function AboutPage (){
return (
    <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-12 py-12">
        <div className="flex justify-center md:w-1/2">
            <Image
                src="/logo_sanare.jpg"
                alt="Logo Sanare"
                width={600}
                height={600}
                className="rounded-lg"
                ></Image>
        </div>

        <div className="md:w-1/2 p-30 bg-blue-200  text-white shadow-lg">
            <h1 className="text-3xl font-semibold mb-4">¿Quiénes somos?</h1>
          <p className="text-base leading-relaxed">
            En <strong>Sanare</strong>, creemos que la salud debe ser accesible,
            organizada y sin complicaciones. Somos una plataforma digital diseñada
            para conectar pacientes y profesionales de la salud de forma ágil y
            segura. Nuestro objetivo es simplificar la gestión médica mediante
            tecnología intuitiva, permitiendo agendar citas, consultar información
            clínica y optimizar el tiempo tanto de médicos como de pacientes.
          </p>

          <div className="flex gap-6 mt-6 text-xl">
            <a href="#" aria-label="Facebook" className="hover:text-gray-100">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-gray-100">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-gray-100">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
    </div>
  );
}