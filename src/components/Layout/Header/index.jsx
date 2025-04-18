import { Link } from "react-router-dom"
import { FaUser } from "react-icons/fa"
import { FaCheckCircle } from "react-icons/fa"
import { SearchBar } from "../../SearchBar";
import logoUrl from '../../../assets/Logo.svg?url';


export function Header () {

    const isLoggedIn = true; // Change this to your real logic later!

    return (
        <header className="bg-creamy h-40 w-full flex justify-between items-center gap-10 p-12">
            <div>
                <Link to="/" className="text-3xl font-bold text-pink-600 hover:text-pink-800">
                    <img src={logoUrl} alt="Logo for Holidaze" className="h-8" />
                </Link>
            </div>
            <div>
                <SearchBar />
            </div>
            <div>
                <nav>
                    <ul className="flex gap-8 text-2xl">
                        <li className="hover:text-orangey text-espressoy relative cursor-pointer">
                            <FaUser />
                            {isLoggedIn && (
                                <FaCheckCircle className="absolute -top-2 -right-1 text-goldy text-sm" />
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}
