import Link from "next/link"

export function Header(){
    return(
        <header className="w-1/2 bg-[#6381A8] text-white py-8 px-6 shadow-md ml-auto">
            <nav className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="text-xl font-bold"></div>
                <div className="flex gap-4 text-sm">
                    <Link href="/" className="hover font-block rounded-3xl px-5 py-2 text-base font-medium text-white hover:bg-white hover:text-black rounded-full ">Home</Link>
                    <Link href="/about" className="hover font-block rounded-3xl px-5 py-2 text-base font-medium text-white hover:bg-white hover:text-black rounded-full:underline font-bold">About</Link>
                    <Link href="/register" className="hover:hover font-block rounded-3xl px-5 py-2 text-base font-medium text-white hover:bg-white hover:text-black rounded-full font-bold">Register</Link>
                </div>
            </nav>
        </header>
    )
}

export default Header