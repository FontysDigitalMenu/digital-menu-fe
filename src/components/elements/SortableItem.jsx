import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { faWineGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function SortableItem({ task }) {
    const { t } = useTranslation()
    const [mouseIsOver, setMouseIsOver] = useState(false)
    const { orderNumber } = useParams()

    const { setNodeRef, attributes, listeners, isDragging } = useSortable({
        id: task.order.id,
        data: {
            type: 'Task',
            task,
        },
        isDrinks: task.isDrinks,
    })

    const drinkStatusColor = task.order.drinkStatus === 'None' ? 'text-white' : task.order.drinkStatus === 'Pending' ? 'text-gray-500' : task.order.drinkStatus === 'Processing' ? 'text-blue-500' : 'text-green-500'

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className={`bg-white p-2.5 items-center flex text-left mb-3
            rounded-xl cursor-grab relative border-2 
            ${orderNumber === task.order.orderNumber ? 'border-blue-500 border-4' : 'border-black'} 
            ${isDragging && 'opacity-30'}
            ${mouseIsOver && 'hover:ring-2 hover:ring-inset hover:ring-red-500'}
            `}
            onMouseEnter={() => {
                setMouseIsOver(true)
            }}
            onMouseLeave={() => {
                setMouseIsOver(false)
            }}
        >
            <div aria-disabled className={`my-auto text-black w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap`}>
                <div className={'flex justify-between'}>
                    <p className="mb-2 font-bold">
                        {t('Order')}: {task.order.orderNumber}
                    </p>
                    {!task.isDrinks && task.order.drinkStatus !== 'None' && (
                        <Link to={'/kitchen/receive/order/drinks/' + task.order.orderNumber} className={`text-xl ${drinkStatusColor}`}>
                            <FontAwesomeIcon icon={faWineGlass} />
                        </Link>
                    )}
                </div>
                <ul className="list-none p-0">
                    {task.order.menuItems.map((item) => (
                        <li key={item.id} className="border border-black rounded mb-2">
                            <div className="flex justify-between items-center">
                                <span className="flex">
                                    <div className="w-7 border-r-2 border-black flex justify-center">{item.quantity}</div>
                                    <div className="pl-2 flex flex-col">
                                        <div>{item.name}</div>
                                        <div>
                                            {item.excludedIngredients.map((excludedIngredient) => {
                                                return (
                                                    <div key={excludedIngredient.id} className="flex gap-2 pt-2">
                                                        <span className="material-symbols-outlined text-red-600">close</span>
                                                        <p>{excludedIngredient.name}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div>{item.note && <span>note: {item.note}</span>}</div>
                                    </div>
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default SortableItem
