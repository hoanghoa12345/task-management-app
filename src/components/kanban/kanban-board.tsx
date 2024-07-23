"use client";

import { Flame, Plus, Trash } from "lucide-react";
import React, { FormEvent, useState } from "react";

export default function KanbanBoard() {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50">
      <Board />
    </div>
  );
}

const defaultCards = [
  // BACKLOG
  { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
  { title: "Create home page", id: "2", column: "backlog" },
  { title: "Get data from backend", id: "3", column: "backlog" },
  // TODO
  { title: "Look into render bug in dashboard", id: "4", column: "todo" },
  { title: "Create home page", id: "5", column: "todo" },
  { title: "Get data from backend", id: "6", column: "todo" },
  // IN PROGRESS
  { title: "[SM-234] Create new login form", id: "7", column: "in-progress" },
  { title: "https://youtu.be/O5lZqqy7VQE?t=757", id: "8", column: "in-progress" },
  // COMPLETED
  { title: "Create home page", id: "9", column: "completed" },
];

const Board = () => {
  const [cards, setCards] = useState(defaultCards);
  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Column
        title="Backlog"
        column="backlog"
        headingColor="bg-red-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Todo"
        column="todo"
        headingColor="bg-yellow-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In progress"
        headingColor="bg-orange-500"
        column="in-progress"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Completed"
        column="completed"
        headingColor="bg-green-500"
        cards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

interface CardProps {
  title: string;
  id: string;
  column: string;
  handleDragStart?: (e: DragEvent, card: CardProps) => void;
}

const Card = ({ title, id, column, handleDragStart }: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <div
        draggable="true"
        onDragStart={(e: any) => handleDragStart?.(e, { title, id, column })}
        className="cursor-grab rounded border border-neutral-700 p-3 active:cursor-grabbing bg-neutral-800"
      >
        <p className="text-sm text-neutral-100">{title}</p>
      </div>
    </>
  );
};

interface DropIndicatorProps {
  beforeId: string;
  column: string;
}

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

interface ColumnProps {
  title: string;
  headingColor: string;
  column: string;
  cards: CardProps[];
  setCards: Function;
}

const Column = ({
  title,
  headingColor,
  column,
  cards,
  setCards,
}: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, card: CardProps) => {
    e.dataTransfer?.setData("cardId", card.id);
  };

  const filteredCards = cards.filter(
    (card: CardProps) => card.column === column
  );

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((card: CardProps) => (
          <Card
            key={card.id}
            title={card.title}
            id={card.id}
            column={card.column}
            handleDragStart={handleDragStart}
          />
        ))}
        <DropIndicator beforeId="-1" column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

const BurnBarrel = ({ setCards }: { setCards: Function }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setActive(true);
  };

  const onDragLeave = () => {
    setActive(false);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      className={`mt-10 grid h-56 w-56 place-items-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <Flame className="animate-bounce" /> : <Trash />}
    </div>
  );
};

interface AddCardProps {
  column: string;
  setCards: Function;
}

const AddCard = ({ column, setCards }: AddCardProps) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim().length) return;
    setCards((prevCards: CardProps[]) => [
      ...prevCards,
      { title: text, id: `${prevCards.length + 1}`, column: column },
    ]);
    setAdding(false);
    setText("");
  };

  return (
    <>
      {adding ? (
        <form onSubmit={handleSubmit}>
          <textarea
            onChange={(e: FormEvent<HTMLTextAreaElement>) =>
              setText((e.target as HTMLTextAreaElement).value)
            }
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0 resize-none"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <Plus />
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add Card</span>
          <Plus />
        </button>
      )}
    </>
  );
};
