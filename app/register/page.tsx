import Image from "next/image"

export default function RegisterPage(){
    return(
       <div className="flex min-h-screen"> 
                      {/* //Formulario de Médico */}
                     <div className="w-1/2 flex items-center justify-center bg-white p-8"> 
                      <form className="w-full max-w-2xl bg-white p-6 space-y-8">
                        <h2 className="text-5xl font-bold text-center">Médico</h2>

                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="gender" value="F" className="accent-blue-500" />
                                <span className="text-sm">F.</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="gender" value="M" className="accent-blue-500" />
                                <span className="text-sm">M.</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4  rounded px-4 py-2 ">
                            <input 
                                type="text" 
                                placeholder="Nombre" 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />

                            <input 
                                type="text" 
                                placeholder="Apellido" 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                        </div>

                        <div className="grid grid-cols-2 gap-4  px-4 py-2">
                            <select 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                                    <option>Área de salud</option>
                                    <option>Cirujano</option>
                            </select>
                            <select 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                                <option>Clínica</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4 px-4 py-2">
                            <input 
                                type="text" 
                                placeholder="Edad" 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            <input 
                                type="text" 
                                placeholder="No." 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 rounded px-4 py-2">
                            <input 
                                type="text" 
                                placeholder="Ciudad" 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            <input 
                                type="text" 
                                placeholder="Postal" 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 px-4 py-2">
                            <input 
                                type="email" 
                                placeholder="E-Mail*" 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            <input 
                                type="text" 
                                placeholder="Telefono" 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>

                         <div className="flex justify-center gap-6 pt-4">
                            <button type="button" className="px-8 py-2 rounded-full bg-blue-200 text-white hover:bg-blue-300">
                                Regresar
                            </button>
                            <button type="submit" className="px-8 py-2 rounded-full bg-[#6381A8] text-white hover:bg-blue-300">
                            Siguiente
                            </button>
                        </div>
                        
                      </form>
                     </div>
               
                     <div className="w-1/2 flex items-center justify-center bg-[#6381A8] p-8"> 
               
                      {/* Formulario de Paciente */}
                        <form className="w-full max-w-2xl bg-[#6381A8] p-8 space-y-8">
                          <h2 className="text-5xl font-bold text-center text-white">Paciente</h2>

                          <div className="flex items-center gap-6 text-white font-bold">
                              <label className="flex items-center gap-2">
                                  <input 
                                    type="radio" 
                                    name="gender" value="F" 
                                    className="accent-blue-500" />
                                  <span className="text-sm">F.</span>
                              </label>
                              <label className="flex items-center gap-2">
                                  <input 
                                    type="radio" 
                                    name="gender" 
                                    value="M" 
                                    className="accent-blue-500" />
                                  <span className="text-sm">M.</span>
                              </label>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-white px-4 py-2">
                              <input 
                                type="text" 
                                placeholder="Nombre" 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white-400" />
                              <input 
                                type="text" 
                                placeholder="Apellido" 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white-400"/>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4  text-white px-4 py-2">
                              <input 
                                type="text" 
                                placeholder="Edad" 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white-400" />
                              <input 
                                type="text" 
                                placeholder="No." 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white-400" />
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-white px-4 py-2">
                              <input 
                                type="text" 
                                placeholder="Ciudad" 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white-400" />
                              <input 
                                type="text" 
                                placeholder="Postal" 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white-400" />
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-white px-4 py-2">
                              <input 
                                type="email" 
                                placeholder="E-Mail*" 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white-400" />
                              <input 
                                type="text" 
                                placeholder="Telefono" 
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white-400" />
                          </div>

                          <div className="flex justify-center gap-6 pt-4 ">
                              <button type="button" className="px-8 py-2 rounded-full bg-blue-200 text-white hover:bg-blue-300">
                                  Regresar
                              </button>
                              <button type="submit" className="px-8 py-2 rounded-full bg-white text-black hover:bg-blue-300">
                              Siguiente
                              </button>
                          </div>
                        </form>
                      </div>
                     </div>
    )
}