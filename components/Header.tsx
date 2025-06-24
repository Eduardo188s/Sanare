import Link from "next/link"

export function Header(){
    return(
        <header className="w-full  bg-blue-200 text-white py-8 px-6 shadow-md">
            <nav className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="text-xl font-bold">Sanare</div>
                <div className="flex gap-4 text-sm">
                    <Link href="/" className="hover:underline font-bold rounded-full ">Home</Link>
                    <Link href="/about" className="hover:underline font-bold">About</Link>
                    <Link href="/register" className="hover:underline font-bold">Login</Link>
                    <Link href="/register" className="hover:underline font-bold">Register</Link>
                </div>
            </nav>
        </header>
    )
}

export default Header