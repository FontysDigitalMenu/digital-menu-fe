import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";

function SortableItem({ task }) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: false,
  });

  const style = {
    transition,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : "none",
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left
            rounded-xl cursor-grab relative ${isDragging ? "opacity-30" : ""}
            ${
              mouseIsOver
                ? "hover:ring-2 hover:ring-inset hover:ring-rose-500"
                : ""
            }`}
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      {editMode ? (
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          autoFocus
          onBlur={toggleEditMode}
          defaultValue={task.content}
        />
      ) : (
        <p
          aria-disabled
          className="my-auto h-[90%] text-white w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"
        >
          {task.content}
        </p>
      )}
    </div>
  );
}

export default SortableItem;
