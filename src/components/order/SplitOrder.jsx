import { useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import ConfigContext from '../../provider/ConfigProvider.jsx'

function SplitOrder() {
    const config = useContext(ConfigContext)
    const navigate = useNavigate()
    const [splitOption, setSplitOption] = useState('Even')
    const [splitAmount, setSplitAmount] = useState(1)
    const [customSplits, setCustomSplits] = useState([{ name: '', amount: '' }])
    const [cartItemCollection, setCartItemCollection] = useState()

    const totalPrice = cartItemCollection ? cartItemCollection.totalAmount / 100 : 0
    const pricePerPerson = totalPrice / splitAmount

    const totalCustomSplitsAmount = customSplits.reduce((total, split) => {
        return total + (split.amount || 0)
    }, 0)

    useEffect(() => {
        if (!config) return
        fetchCartItems()
    }, [config])

    const handleSelectChange = (e) => {
        setSplitOption(e.target.value)
    }

    const handleSplitAmountChange = (e) => {
        let value = parseInt(e.target.value)
        if (!isNaN(value)) {
            value = Math.min(Math.max(value, 1), 99)
            setSplitAmount(value)
        } else {
            setSplitAmount(value)
        }
    }

    const handleAddCustomSplit = () => {
        setCustomSplits([...customSplits, { name: '', amount: '' }])
    }

    const handleRemoveCustomSplit = (indexToRemove) => {
        setCustomSplits((prevCustomSplits) => prevCustomSplits.filter((_, index) => index !== indexToRemove))
    }

    const handleCustomSplitNameChange = (index, e) => {
        const newCustomSplits = [...customSplits]
        newCustomSplits[index].name = e.target.value
        setCustomSplits(newCustomSplits)
    }

    const handleCustomSplitValueChange = (index, e) => {
        const newCustomSplits = [...customSplits]
        newCustomSplits[index].amount = parseInt(e.target.value * 100) || ''
        setCustomSplits(newCustomSplits)
    }

    async function fetchCartItems() {
        const response = await fetch(`${config.API_URL}/api/v1/CartItem/${localStorage.getItem('deviceId')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })

        if (response.status === 200) {
            const data = await response.json()
            setCartItemCollection(data)
        } else if (response.status === 404) {
            setCartItemCollection(null)
        }
    }

    async function handleConfirmOrder() {
        const response = await fetch(`${config.API_URL}/api/v1/Order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                splits: customSplits.map((s) => ({
                    amount: s.amount,
                    name: s.name,
                })),
                deviceId: localStorage.getItem('deviceId'),
                tableId: localStorage.getItem('tableId'),
            }),
        })

        if (response.status === 201) {
            const data = await response.json()
            console.log(data)
            return navigate(`/order/progress/${data.id}`)
        } else if (response.status === 400) {
            const data = await response.json()
            if (data?.errors?.TableId) {
                toast.error('Please scan the QR-Code on your table using your camera on your phone', {
                    autoClose: 8000,
                })
            } else {
                console.log(data)
                toast.error(data.message, {
                    autoClose: 8000,
                })
            }
        } else if (response.status === 404) {
        } else if (response.status === 500) {
        }
    }

    return (
        <div className="relative flex flex-col justify-between min-h-screen">
            <div className="mt-6 w-full flex justify-center">
                <div className="w-96 md:w-[500px]">
                    <div className="title-box text-left text-2xl font-bold w-full px-2">
                        <p>Split the bill</p>
                        <p className="pt-1">
                            Total price:{' '}
                            {new Intl.NumberFormat('nl-NL', {
                                style: 'currency',
                                currency: 'EUR',
                            }).format(totalPrice)}
                        </p>
                    </div>
                    <div className="text-box flex flex-col px-2">
                        <p className="text-left pt-5 pb-2 font-style: italic">Split option</p>
                        <select className="bg-gray-300 border border-gray-300 rounded-lg block p-2 mb-4" value={splitOption} onChange={handleSelectChange}>
                            <option value="Even">Split evenly</option>
                            <option value="Custom">Split in custom ranges</option>
                        </select>
                        {splitOption === 'Even' ? (
                            <div>
                                <p className="text-left pt-4 pb-2 font-style: italic">Number of splits</p>
                                <input className="bg-gray-300 w-[15%] p-2 rounded-lg" type="number" min="1" max="99" maxLength={2} value={splitAmount} onChange={handleSplitAmountChange} />
                            </div>
                        ) : (
                            <div>
                                <p className="text-left pt-4 font-style: italic">Custom splits</p>
                                {customSplits.map((split, index) => (
                                    <div key={index} className="flex pt-2 items-center">
                                        <p className="mr-1">€</p>
                                        <input className="bg-gray-300 w-[20%] p-2 rounded-lg mr-1" type="number" min="0" max={totalPrice} placeholder="Value" value={split.amount} onChange={(e) => handleCustomSplitValueChange(index, e)} />
                                        <input className="bg-gray-300 w-[70%] p-2 rounded-lg ml-1 mr-1" type="text" placeholder="Name" value={split.name} onChange={(e) => handleCustomSplitNameChange(index, e)} />
                                        <button className="bg-red-500 w-[10%] text-white p-2 rounded-lg ml-1" onClick={() => handleRemoveCustomSplit(index)}>
                                            -
                                        </button>
                                    </div>
                                ))}
                                <button className="bg-green-500 w-[100%] text-white rounded-lg px-4 py-2 mt-2" onClick={handleAddCustomSplit}>
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bottom-box w-full sticky bottom-0 left-0" style={{ backgroundColor: 'rgb(255,255,255,.8)' }}>
                {splitOption === 'Even' ? (
                    <div className="flex text-2xl font-bold w-full px-2 items-center justify-center">
                        Price per person: &nbsp;
                        {pricePerPerson
                            ? new Intl.NumberFormat('nl-NL', {
                                  style: 'currency',
                                  currency: 'EUR',
                              }).format(pricePerPerson)
                            : '-'}
                    </div>
                ) : (
                    <div className="flex text-2xl font-bold w-full px-2 items-center justify-center">
                        Left to split: &nbsp;
                        {new Intl.NumberFormat('nl-NL', {
                            style: 'currency',
                            currency: 'EUR',
                        }).format(totalPrice - totalCustomSplitsAmount)}
                    </div>
                )}
                <div className="text-2xl w-full h-1/2 flex items-center justify-center pt-2.5">
                    <button onClick={handleConfirmOrder} className="flex items-center py-2 h-full text-white rounded-2xl italic mb-3 justify-center w-9/12 bg-red-500 hover:bg-red-600">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SplitOrder
