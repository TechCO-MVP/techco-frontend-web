import { FC } from "react";

type ChatReadonlyListProps = {
  message: string;
  items: string[];
};

export const ReadonlyList: FC<ChatReadonlyListProps> = ({ message, items }) => {
  return (
    <div className="space-y-4">
      <p>{message}</p>

      <ul className="list-disc space-y-1 pl-6">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
