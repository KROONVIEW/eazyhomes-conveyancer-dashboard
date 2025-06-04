import React, { useState } from "react";
import ProgressBar from "./ProgressBar";

const Checklist = ({ initialItems }) => {
  const [items, setItems] = useState(initialItems);
  const percent = Math.round((items.filter(i => i.done).length / items.length) * 100);

  const toggle = (id) => {
    setItems(items => items.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };

  return (
    <div>
      <div className="mb-3"><ProgressBar percent={percent} /></div>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggle(item.id)}
              className="accent-blue-600 w-4 h-4 rounded"
            />
            <span className={`text-sm ${item.done ? "line-through text-gray-400" : "text-gray-800"}`}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Checklist; 