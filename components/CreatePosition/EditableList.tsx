import { Trash2 } from "lucide-react";
import React, { useState } from "react";

export const EditableList = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      text: "Diseñar e implementar arquitecturas escalables y eficientes",
    },
    {
      id: 2,
      text: "Liderar equipos de desarrollo en entornos ágiles (Scrum/Kanban)",
    },
    {
      id: 3,
      text: "Colaborar con stakeholders para definir requerimientos y mejoras técnicas",
    },
    {
      id: 4,
      text: "Implementar buenas prácticas de código y garantizar la calidad del software.",
    },
    {
      id: 5,
      text: "Optimizar el rendimiento y escalabilidad de las plataformas internas.",
    },
    {
      id: 6,
      text: "Investigar nuevas tecnologías y herramientas para mejorar los procesos",
    },
  ]);
  const [editingId, setEditingId] = useState<number>();
  const [newText, setNewText] = useState("");

  const handleTextChange = (id: number, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: value } : item)),
    );
  };

  const handleAddItem = () => {
    if (newText.trim() === "") return;
    const newItem = {
      id: Date.now(),
      text: newText,
    };
    setItems([...items, newItem]);
    setNewText("");
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          className="group flex items-center gap-2 py-1"
          onClick={() => setEditingId(item.id)}
        >
          {editingId === item.id ? (
            <input
              autoFocus
              value={item.text}
              onChange={(e) => handleTextChange(item.id, e.target.value)}
              onBlur={() => setEditingId(undefined)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setEditingId(undefined);
              }}
              className="w-full border-b border-gray-300 focus:outline-none"
            />
          ) : (
            <span className="flex w-full cursor-pointer items-start gap-2 text-gray-600">
              {item.text}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item.id);
            }}
            className="opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-3" />
          </button>
        </div>
      ))}
      <div className="py-2">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddItem();
          }}
          placeholder="Agrega un nuevo elemento aquí"
          className="w-full border-b border-gray-300 focus:outline-none"
        />
      </div>
    </div>
  );
};
