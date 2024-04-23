import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../provider/ConfigProvider.jsx'

function SplitOrder() {
    const [splitAmount, setSplitAmount] = useState(1)
    const [customSplit, setCustomSplit] = useState(false)

    const handleSelectChange = (e) => {
        setCustomSplit(e.target.value === 'Custom')
    }

    const handleSplitAmountChange = (e) => {
        setSplitAmount(parseInt(e.target.value) || 1)
    }

    return (
        <div className="relative flex flex-col justify-between min-h-screen">
            <div className="mt-6 w-full flex justify-center">
                <div className="w-96 md:w-[500px]">
                    <div className="title-box text-2xl font-bold w-full px-2">
                        <p className="text-left">Split the bill</p>
                        <p className="text-left pt-2">Left to split: €30,00</p>
                    </div>
                    <div className="text-box min-h-screen flex flex-col px-2">
                        <div className="select-box mt-1">
                            <form class="max-w-sm mx-auto">
                                <label for="choices" class="block mb-2 mt-4 font-style: italic">
                                    Select an option
                                </label>
                                <select id="choices" className="bg-gray-300 border border-gray-300 rounded-lg block p-2" onChange={handleSelectChange}>
                                    <option selected value="Even">
                                        Split evenly
                                    </option>
                                    <option value="Custom">Split in custom ranges</option>
                                </select>
                            </form>
                        </div>
                        <p className="text-left pt-4 pb-2 font-style: italic">Number of splits</p>
                        <input className="bg-gray-300 w-[20%] p-2 rounded-lg" type="number" onChange={handleSplitAmountChange} />
                        {customSplit && (
                            <div>
                                <p className="text-left pt-4 pb-2 font-style: italic">Custom splits</p>
                                {[...Array(splitAmount)].map((_, index) => (
                                    <div key={index} className="mt-1">
                                        <input className="bg-gray-300 w-[20%] p-2 rounded-lg mt-1" type="number" placeholder={`Split ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SplitOrder
