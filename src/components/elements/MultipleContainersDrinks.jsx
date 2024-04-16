import { useContext, useEffect, useMemo, useState } from 'react'
import ColumnContainer from './ColumnContainer'
import { DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import ConfigContext from '../../provider/ConfigProvider.jsx'
import SortableItem from './SortableItem'

const defaultCols = [
    {
        id: 'Pending',
        title: 'Pending',
    },
    {
        id: 'Completed',
        title: 'Completed',
    },
]

function MultipleContainers({ orders }) {
    const config = useContext(ConfigContext)
    const [columns, setColumns] = useState(defaultCols)
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns])
    const [tasks, setTasks] = useState([])
    const [activeColumn, setActiveColumn] = useState(null)
    const [activeTask, setActiveTask] = useState(null)
    useEffect(() => {
        console.log(orders)
        transformOrder(orders)
    }, [orders])

    function transformOrder(orders) {
        let newTasks = []
        orders.forEach((order) => {
            newTasks.push({
                id: order.id,
                columnId: order.status,
                order: order,
            })
        })
        setTasks(newTasks)
    }

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 75,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    return (
        <div className="flex w-full items-center overflow-x-auto overflow-y-hidden pt-10">
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <div className="mx-auto flex gap-4 justify-center w-full px-2">
                    <div className="flex gap-4 w-[60%]">
                        <SortableContext items={columnsId} className="cursor-default w-full">
                            {columns.map((col) => (
                                <ColumnContainer key={col.id} column={col} deleteTask={deleteTask} updateTask={updateTask} tasks={tasks.filter((task) => task.columnId === col.id)} />
                            ))}
                        </SortableContext>
                    </div>
                </div>

                {createPortal(<DragOverlay>{activeTask && <SortableItem task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />}</DragOverlay>, document.body)}
            </DndContext>
        </div>
    )

    function deleteTask(id) {
        const newTasks = tasks.filter((task) => task.id !== id)
        setTasks(newTasks)
    }

    function updateTask(id, content) {
        const newTasks = tasks.map((task) => {
            if (task.id !== id) return task
            return { ...task, content }
        })

        setTasks(newTasks)
    }

    function onDragStart(event) {
        const isTaskDrag = event.active.data.current?.type === 'Task'
        if (!isTaskDrag) {
            event.cancel()
            return
        }

        setActiveTask(event.active.data.current.task)
    }

    function onDragEnd(event) {
        setActiveTask(null)

        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id

        const isActiveATask = active.data.current?.type === 'Task'
        const isOverATask = over.data.current?.type === 'Task'
        const isOverAColumn = over.data.current?.type === 'Column'

        if (!isActiveATask || !isOverATask) return

        setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId)
            const overIndex = tasks.findIndex((t) => t.id === overId)

            if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                tasks[activeIndex].columnId = tasks[overIndex].columnId
                return arrayMove(tasks, activeIndex, overIndex - 1)
            }

            return arrayMove(tasks, activeIndex, overIndex)
        })
    }

    function onDragOver(event) {
        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return

        const isActiveATask = active.data.current?.type === 'Task'
        const isOverATask = over.data.current?.type === 'Task'

        if (!isActiveATask) return

        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId)
                const overIndex = tasks.findIndex((t) => t.id === overId)

                if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                    tasks[activeIndex].columnId = tasks[overIndex].columnId
                    return arrayMove(tasks, activeIndex, overIndex - 1)
                }

                return arrayMove(tasks, activeIndex, overIndex)
            })
        }

        const isOverAColumn = over.data.current?.type === 'Column'

        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId)

                tasks[activeIndex].columnId = overId
                console.log('DROPPING TASK OVER COLUMN', { activeIndex })
                return arrayMove(tasks, activeIndex, activeIndex)
            })
        }
    }
}

export default MultipleContainers
