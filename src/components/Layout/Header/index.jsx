import { Link } from "react-router-dom"
// import { AiFillHome } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

// Choose icons here: https://react-icons.github.io/react-icons/

export function Header () {
    return (
        <>
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
                            <li className="hover:text-pink-800">
                                <FaUser />
                            </li>
                            <li className="hover:text-pink-800">
                                <FaCheckCircle />
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    )
}