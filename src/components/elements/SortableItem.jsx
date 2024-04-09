import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";

function SortableItem({ order }) {
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: order.id,
    data: {
      type: "Task",
      order,
    },
    disabled: false,
  });

  const style = {
    transition,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-gray-400 p-2.5 items-center flex text-left
            rounded-xl cursor-grab relative ${isDragging ? "opacity-30" : ""}
            ${
              mouseIsOver
                ? "hover:ring-2 hover:ring-inset hover:ring-red-500"
                : ""
            }`}
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <div
        aria-disabled
        className="my-auto text-black w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"
      >
       
                                <p>Order: {order.id}</p>
                                <ul className="list-none p-0">
                                    {order.menuItems.map((item) => (
                                        <div key={item.id}>
                                            <li key={item.id} className="border border-black rounded mb-2">
                                                <div className="flex justify-between items-center">
                                        <span>
                                            {item.quantity} | {item.name} -{" "}
                                            {new Intl.NumberFormat("nl-NL", {
                                                style: "currency",
                                                currency: "EUR",
                                            }).format(item.price / 100)}
                                        </span>
                                                </div>
                                            </li>
                                            {item.note && <li className="border border-black rounded mb-2">{item.note}</li>}
                                        </div>
                                    ))}
                                </ul>
                    </div>
            </div>
  );
}

export default SortableItem;
