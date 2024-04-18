import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'

function SortableItem({ task }) {
    const [mouseIsOver, setMouseIsOver] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.order.id,
        data: {
            type: 'Task',
            task,
        },
        disabled: false,
    })

    const style = {
        transition,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none',
    }

    const toggleEditMode = () => {
        setEditMode((prev) => !prev)
        setMouseIsOver(false)
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-white p-2.5 items-center flex text-left
            rounded-xl cursor-grab relative border-2 border-black mb-3 ${isDragging ? 'opacity-30' : ''}
            ${mouseIsOver ? 'hover:ring-2 hover:ring-inset hover:ring-red-500' : ''}`}
            onMouseEnter={() => {
                setMouseIsOver(true)
            }}
            onMouseLeave={() => {
                setMouseIsOver(false)
            }}
        >
            {editMode ? (
                <textarea className="w-full resize-none border-none rounded bg-transparent text-white focus:outline-none " autoFocus onBlur={toggleEditMode} defaultValue={task.content} />
            ) : (
                <div aria-disabled className="my-auto text-black w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
                    <p className="mb-2 font-bold">Order: {task.order.orderNumber}</p>
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
            )}
        </div>
    )
}

export default SortableItem
