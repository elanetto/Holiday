import { Link } from "react-router-dom"
import { FaUser } from "react-icons/fa"
import { FaCheckCircle } from "react-icons/fa"

export function Header () {

    const isLoggedIn = true; // Change this to your real logic later!

    return (
        <header className="bg-pink-100 h-40 w-full flex justify-between items-center gap-10 p-12">
            <div>
                <Link to="/" className="text-3xl font-bold text-pink-600 hover:text-pink-800">Logo</Link>
            </div>
            <div>
                <p className="text-gray-500 italic">Search thingy</p>
            </div>
            <div>
                <nav>
                    <ul className="flex gap-8 text-2xl">
                        <li className="hover:text-pink-800 relative">
                            <FaUser />
                            {isLoggedIn && (
                                <FaCheckCircle className="absolute -top-2 -right-1 text-green-500 text-sm" />
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}
