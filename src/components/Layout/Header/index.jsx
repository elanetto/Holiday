export function Header () {
    return (
        <>
            <header className="bg-pink-100 h-40 w-full flex justify-between">
                <div>
                    <p className="text-pink-600 font-bold text-xl">Logo</p>
                </div>
                <div>
                    <p className="text-gray-500 italic">Search thingy</p>
                </div>
                <div>
                    <nav>
                        <ul>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">About</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    )
}