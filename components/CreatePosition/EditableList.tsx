import { Plus, Trash2 } from "lucide-react";
import React, { FC, useState } from "react";
import { Button } from "../ui/button";

type Props = {
  items: string[];
  onItemsChange: (items: string[]) => void;
};

export const EditableList: FC<Props> = ({ items, onItemsChange }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newText, setNewText] = useState("");

  const handleTextChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    onItemsChange(updated);
  };

  const handleAddItem = () => {
    if (newText.trim() === "") return;
    onItemsChange([...items, newText.trim()]);
    setNewText("");
  };

  const handleDelete = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onItemsChange(updated);
  };

  return (
    <div>
      {items.map((text, index) => (
        <div
          key={index}
          className="group flex items-center gap-2 py-1"
          onClick={() => setEditingIndex(index)}
        >
          {editingIndex === index ? (
            <input
              autoFocus
              value={text}
              onChange={(e) => handleTextChange(index, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setEditingIndex(null);
              }}
              className="w-full border-b border-gray-300 focus:outline-none"
            />
          ) : (
            <span className="flex w-full cursor-pointer items-start gap-2 text-gray-600">
              {text}
            </span>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(index);
            }}
          >
            <Trash2 className="w-3" />
          </Button>
        </div>
      ))}
      <div className="flex items-center gap-2 py-2">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddItem();
          }}
          placeholder="Esto es una lista, escribe un dato, presiona Enter para guardarlo y habilitar otro."
          className="w-full border-b border-gray-300 focus:outline-none"
        />
        <Button variant="outline" size="icon" onClick={handleAddItem}>
          <Plus className="w-4" />
        </Button>
      </div>
    </div>
  );
};
