import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import ConfigContext from '../../provider/ConfigProvider.jsx'

function SplitOrder() {
    const config = useContext(ConfigContext)
    const navigate = useNavigate()
    const [splitOption, setSplitOption] = useState('Even')
    const [splitAmount, setSplitAmount] = useState(1)
    const [customSplits, setCustomSplits] = useState([{ name: '', value: '' }])

    const handleSelectChange = (e) => {
        setSplitOption(e.target.value)
    }

    const handleSplitAmountChange = (e) => {
        setSplitAmount(parseInt(e.target.value) || 1)
    }

    const handleAddCustomSplit = () => {
        setCustomSplits([...customSplits, { name: '', value: '' }])
    }

    const handleCustomSplitNameChange = (index, e) => {
        const newCustomSplits = [...customSplits]
        newCustomSplits[index].name = e.target.value
        setCustomSplits(newCustomSplits)
    }

    const handleCustomSplitValueChange = (index, e) => {
        const newCustomSplits = [...customSplits]
        newCustomSplits[index].value = parseInt(e.target.value) || ''
        setCustomSplits(newCustomSplits)
    }

    async function handleConfirmOrder() {
        const response = await fetch(`${config.API_URL}/api/v1/Order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                splits: [{ name: 'Split 1', amount: 9000 }],
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
        <div className="relative flex flex-col justify-between">
            <div className="mt-6 w-full flex justify-center">
                <div className="w-96 md:w-[500px]">
                    <div className="title-box text-left text-2xl font-bold w-full px-2">
                        <p>Split the bill</p>
                        <p className="pt-1">Left to split: €30,00</p>
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
                                <input className="bg-gray-300 w-[20%] p-2 rounded-lg" type="number" min="0" value={splitAmount} onChange={handleSplitAmountChange} />
                            </div>
                        ) : (
                            <div>
                                <p className="text-left pt-4 font-style: italic">Custom splits</p>
                                {customSplits.map((split, index) => (
                                    <div key={index} className="flex pt-2">
                                        <input className="bg-gray-300 w-[30%] p-2 rounded-lg mr-1" type="number" placeholder="Value" value={split.value} onChange={(e) => handleCustomSplitValueChange(index, e)} />
                                        <input className="bg-gray-300 w-[70%] p-2 rounded-lg ml-1" type="text" placeholder="Name" value={split.name} onChange={(e) => handleCustomSplitNameChange(index, e)} />
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

            <div className="text-2xl w-full h-1/2 flex items-center justify-center">
                <button onClick={handleConfirmOrder} className="flex items-center py-2 h-full text-white rounded-2xl italic mb-3 justify-center w-9/12 bg-red-500 hover:bg-red-600">
                    Confirm
                </button>
            </div>
        </div>
    )
}

export default SplitOrder
