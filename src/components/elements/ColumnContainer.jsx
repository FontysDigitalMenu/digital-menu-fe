import TrashIcon from '../icons/TrashIcon'
import { useContext, useMemo, useState } from 'react'
import PlusIcon from '../icons/PlusIcon'
import SortableItem from './SortableItem'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import SettingsContext from '../../provider/SettingsProvider.jsx'

function ColumnContainer({ column, tasks, deleteTask, updateTask }) {
    const setting = useContext(SettingsContext)

    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id)
    }, [tasks])

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`bg-columnBackgroundColor opacity-40 border-2 border-[${setting.primaryColor}]
      w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col`}
            ></div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-gray-200 w-[300px] md:w-1/2 min-h-[500px] rounded-lg
    flex flex-col"
        >
            <div
                {...attributes}
                {...listeners}
                className=" bg-gray-200 text-md h-[60px] cursor-default rounded-md rounded-b-none p-3 font-bold
            border-gray-200 border-4 flex items-center justify-between"
            >
                <div className="flex gap-2">
                    <p className=" bg-gray-200">{column.title}</p>
                </div>
            </div>

            <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                <div>
                    {tasks
                        .sort((a, b) => new Date(a.order.orderDate) - new Date(b.order.orderDate))
                        .map((task) => {
                            return <SortableItem key={task.id} task={task} />
                        })}
                </div>
            </div>
        </div>
    )
}

export default ColumnContainer
