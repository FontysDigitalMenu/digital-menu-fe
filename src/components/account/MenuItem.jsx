function MenuItem({menuItem}) {
    return (
        <div className="bg-gray-100 shadow-lg mt-5 rounded-xl">
            <div className="product-card w-full h-24 md:h-28 mx-auto flex">
                <div className="image-box h-full flex items-center justify-center">
                    <div className="ml-2.5 w-20 bg-white rounded-xl">
                        <img className="rounded-xl object-cover aspect-square"
                             src={menuItem.imageUrl}
                             alt="Image product"/>
                    </div>
                </div>
                <div className="product-box w-6/12 px-2 h-full flex items-center">
                    <div className="inner-box size-5/6">
                        <p className="name-box first-letter:capitalize h-1/2 font-semibold text-xl">{menuItem.name}</p>
                        <p className="price-box h-1/2 flex items-end text-xl">
                            {new Intl.NumberFormat('nl-NL', {
                                style: 'currency',
                                currency: 'EUR'
                            }).format(menuItem.price / 100)}
                        </p>
                    </div>
                </div>
                <div className="amount-box h-full w-32">
                    <div className="size-full flex items-center justify-center p-2">
                        <div className="rounded-full overflow-hidden bg-white h-8 w-8 flex text-lg">
                            <div className="font-bold flex items-center w-full justify-center">
                                {menuItem.quantity}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MenuItem;
