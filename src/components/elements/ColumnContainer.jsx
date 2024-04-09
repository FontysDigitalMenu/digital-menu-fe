import TrashIcon from "../icons/TrashIcon";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import SortableItem from "./SortableItem";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function ColumnContainer({ column, tasks, deleteTask, updateTask }) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColor opacity-40 border-2 border-pink-500
      w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-400 w-[300px] md:w-1/3 min-h-[500px] rounded-lg
    flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        className="bg-gray-400 text-md h-[60px] cursor-default rounded-md rounded-b-none p-3 font-bold
            border-gray-400 border-4 flex items-center justify-between"
      >
        <div className="flex gap-2">
          <p className=" bg-gray-400">{column.title}</p>
        </div>
      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <div items={tasksIds}>
          {tasks.map((task) => (
            <SortableItem
              key={task.id}
              order={task.order}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ColumnContainer;
