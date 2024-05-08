import { useContext, useEffect, useState, useRef, useLayoutEffect } from 'react'
import ConfigContext from '../provider/ConfigProvider.jsx'
import ToastNotification from './notifications/ToastNotification.jsx'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

function Home() {
    const config = useContext(ConfigContext)
    const [categories, setCategories] = useState([])
    const [lastId, setLastId] = useState(0)
    const [loading, setLoading] = useState(false)
    const observer = useRef()
    const isFirstRun = useRef(true)

    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (isFirstRun.current) {
            if (config) {
                fetchCategories().then((r) => r)
                isFirstRun.current = false
            }
        }
    }, [config])

    useEffect(() => {
        if (categories.length > 0) {
            observer.current = new IntersectionObserver(handleObserver, {
                root: null,
                rootMargin: '20px',
                threshold: 1.0,
            })
            if (observer.current) {
                observer.current.observe(document.querySelector('#bottom-of-page'))
            }
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect()
            }
        }
    }, [categories])

    const handleObserver = (entities) => {
        const target = entities[0]
        if (target.isIntersecting && !loading) {
            fetchCategories().then((r) => r)
        }
    }

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${config.API_URL}/api/v1/MenuItem/GetCategories?lastId=${lastId}&amount=6`)

            if (!response.ok) {
                console.error('Failed to fetch categories')
                return
            }

            const data = await response.json()
            updateCategories(data)
            setLastId((prevLastId) => prevLastId + 6)
        } catch (error) {
            console.error('Error fetching categories:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddToOrder = async (id) => {
        if (!localStorage.getItem('tableSessionId')) {
            toast.error('Please scan the QR-Code on your table using your camera on your phone', {
                autoClose: 8000,
            })
            return
        }
        const response = await fetch(`${config.API_URL}/api/v1/CartItem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                menuItemId: id,
                tableSessionId: localStorage.getItem('tableSessionId'),
            }),
        })

        if (response.status === 204) {
            ToastNotification('success', 'Added item to order')
        } else if (response.status === 404) {
            toast.error('Please scan the QR-Code on your table using your camera on your phone', {
                autoClose: 8000,
            })
        } else {
            ToastNotification('error', 'Error while adding item to order')
        }
    }

    const updateCategories = (data) => {
        data.forEach((fetchedCategory) => {
            const existingCategoryIndex = findExistingCategoryIndex(fetchedCategory)
            if (existingCategoryIndex !== -1) {
                mergeMenuItemsIntoExistingCategory(existingCategoryIndex, fetchedCategory)
            } else {
                addNewCategory(fetchedCategory)
            }
        })
    }

    const findExistingCategoryIndex = (fetchedCategory) => {
        return categories.findIndex((existingCategory) => existingCategory.id === fetchedCategory.id)
    }

    const mergeMenuItemsIntoExistingCategory = (existingCategoryIndex, fetchedCategory) => {
        const updatedCategories = [...categories]
        updatedCategories[existingCategoryIndex].menuItems = [...updatedCategories[existingCategoryIndex].menuItems, ...fetchedCategory.menuItems]
        setCategories(updatedCategories)
    }

    const addNewCategory = (newCategory) => {
        setCategories((prevCategories) => [...prevCategories, newCategory])
    }

    return (
        <div className="relative flex flex-col justify-between min-h-screen">
            <div className="min-h-screen flex flex-col bg-gray-50">
                <div className="p-2 md:p-4">
                    <div className="mb-8 flex md:flex-row items-center w-full overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {categories.map((category) => (
                            <a key={category.id} href={`#${category.name}`} className="cursor-pointer bg-gray-300 py-0.5 px-8 mx-1 mt-2 md:mt-0 text-2xl rounded-xl text-white">
                                {category.name}
                            </a>
                        ))}
                    </div>

                    {categories.map((category) => (
                        <div key={category.name} id={category.name} className="mb-16">
                            <div className="flex justify-center items-center">
                                <h2 className="text-4xl font-semibold">{category.name}</h2>
                            </div>
                            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
                                {category.menuItems.map((menuItem) => (
                                    <div key={menuItem.id} className="flex flex-col justify-between bg-white shadow-lg rounded-lg p-4">
                                        <Link to={`/menu/${menuItem.id}`}>
                                            <img className="h-40 md:h-52 w-full object-cover" src={menuItem.imageUrl} alt={menuItem.name} />
                                            <div key={menuItem.id} className="flex items-center justify-between pt-2 font-medium text-lg">
                                                <p>{menuItem.name}</p>
                                                <p>
                                                    {new Intl.NumberFormat('nl-NL', {
                                                        style: 'currency',
                                                        currency: 'EUR',
                                                    }).format(menuItem.price / 100)}
                                                </p>
                                            </div>
                                        </Link>
                                        <button onClick={() => handleAddToOrder(menuItem.id)} className="w-full mt-2 text-white bg-red-500 hover:bg-red-600 focus:ring-2 focus:outline-none focus:ring-red-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                            Add to order
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div id="bottom-of-page" style={{ height: '1px' }}></div>
                </div>
            </div>

            <div className="bottom-box w-full sticky bottom-0 left-0" style={{ backgroundColor: 'rgb(255,255,255,.8)' }}>
                <div className="text-2xl w-full h-1/2 flex items-center justify-center pt-2.5">
                    <Link to="/cart" className="flex items-center py-2 h-full text-white rounded-2xl italic mb-3 justify-center w-9/12 bg-red-500 hover:bg-red-600">
                        View order
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home
