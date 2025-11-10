// Type definitions for the Simple React App

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface CounterProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

export interface TodoListProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}