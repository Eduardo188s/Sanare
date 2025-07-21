import Image from 'next/image';

export function HomePage() {
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
          <p className="text-xl text-justify leading-relaxed max-w-2xl">
            <strong>Sanare</strong> ha sido diseñada para hacer tu experiencia médica más
            simple, rápida y organizada. Desde esta plataforma podrás agendar
            tus citas, recibir recordatorios, consultar tu historial y encontrar el
            profesional de salud adecuado para ti. Nos comprometemos a
            brindarte una herramienta segura y accesible, para que tú solo te
            concentres en lo más importante: tu bienestar.
          </p>
          <p className="text-xl mt-8">
            ¡Gracias por confiar en Sanare!
          </p>
        </div>
        <div className="flex justify-center space-x-6 p-4">
          {/* Ícono de Facebook */}
          <a href="#" className="text-white hover:text-gray-200">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.502 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.262c-1.247 0-1.649.773-1.649 1.574V12h2.775l-.444 2.891h-2.331v6.987C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>
          <a href="#" className="text-white hover:text-gray-200">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.46 6c-.84.37-1.75.62-2.67.73.96-.58 1.7-1.5 2.04-2.59-.9.53-1.9.92-2.93 1.12-1.01-1.07-2.46-1.7-4.06-1.7-3.08 0-5.58 2.5-5.58 5.58 0 .44.05.87.14 1.28-4.63-.23-8.73-2.45-11.48-5.8c-.48.82-.76 1.77-.76 2.78 0 1.93.98 3.62 2.47 4.63-.91 0-1.76-.28-2.5-.69v.07c0 2.7 1.93 4.95 4.5 5.46-.47.13-.97.2-1.48.2-.36 0-.71-.03-1.06-.1.71 2.23 2.78 3.84 5.23 3.89-1.92 1.5-4.34 2.4-6.97 2.4-.46 0-.91-.03-1.35-.08 2.48 1.59 5.43 2.52 8.59 2.52 10.3 0 15.93-8.54 15.93-15.93 0-.24-.01-.48-.02-.72.95-.69 1.77-1.55 2.42-2.54z"/>
            </svg>
          </a>
          <a href="#" className="text-white hover:text-gray-200">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07c1.17.057 1.745.288 2.224.477.58.238 1.054.55 1.516 1.015.462.462.778.936 1.016 1.516.189.479.42 1.054.477 2.224.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.057 1.17-.288 1.745-.477 2.224-.238.58-.55 1.054-1.015 1.516-.462.462-.936.778-1.516 1.016-.479.189-1.054.42-2.224.477-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.057-1.745-.288-2.224-.477-.58-.238-1.054-.55-1.516-1.015-.462-.462-.778-.936-1.016-1.516-.189-.479-.42-1.054-.477-2.224-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.057-1.17.288-1.745.477-2.224.238-.58.55-1.054 1.015-1.516.462-.462.936-.778 1.516-1.016.479-.189 1.054-.42 2.224-.477C8.416 2.175 8.796 2.163 12 2.163zm0 1.411c-3.15 0-3.535.012-4.755.068-1.082.052-1.59.264-1.898.388-.36.146-.665.342-.962.639-.297.297-.493.602-.639.962-.124.308-.336.816-.388 1.898-.056 1.22-.068 1.605-.068 4.755s.012 3.535.068 4.755c.052 1.082.264 1.59.388 1.898.146.36.342.665.639.962.297.297.602.493.962.639.308.124.816.336 1.898.388 1.22.056 1.605.068 4.755.068s3.535-.012 4.755-.068c1.082-.052 1.59-.264 1.898-.388.36-.146.665-.342.962-.639.297-.297.493-.602.639-.962.124-.308.336-.816.388-1.898.056-1.22.068-1.605.068-4.755s-.012-3.535-.068-4.755c-.052-1.082-.264-1.59-.388-1.898-.146-.36-.342-.665-.639-.962-.297-.297-.602-.493-.962-.639-.308-.124-.816-.336-1.898-.388C15.535 3.586 15.15 3.574 12 3.574zm0 2.215a5.811 5.811 0 100 11.623 5.811 5.811 0 000-11.623zm0 1.411a4.4 4.4 0 110 8.8 4.4 4.4 0 010-8.8zm6.556-2.617a1.378 1.378 0 100 2.756 1.378 1.378 0 000-2.756z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default HomePage;