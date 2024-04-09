function LogoutButton({ onClick }) {
    return (
        <li>
            <button onClick={onClick} className="w-full">
                <div className="flex justify-start rounded-lg text-white hover:bg-red-600 group">
                    <div className="flex items-center p-2">
                        <span className="material-symbols-outlined text-2xl">logout</span>
                        <span className="flex-1 ms-3 whitespace-nowrap">Sign out</span>
                    </div>
                </div>
            </button>
        </li>
    )
}

export default LogoutButton
