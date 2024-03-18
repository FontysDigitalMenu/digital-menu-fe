const NavBarItem = ({ href, icon, text }) => {
    return (
        <li>
            <a
                href={href}
                className='flex items-center p-2 rounded-lg text-white hover:bg-red-600 group'
            >
                <span className="material-symbols-outlined text-2xl">{icon}</span>
                <span className="ms-3">{text}</span>
            </a>
        </li>
    );
};

export default NavBarItem;
