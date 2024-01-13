import { useState } from "react";
import axios from "axios";
import EditTodoDialog from "./EditTodoDialog";
import { Star } from "lucide-react";
import { Calendar } from "lucide-react";

import {
  format,
  isThisWeek,
  isToday,
  isTomorrow,
  formatDistanceToNow,
} from "date-fns";
import { Checkbox } from "./ui/checkbox";

type TodoType = {
  id: number;
  title: string;
  note: string;
  pinned: boolean;
  completed: boolean;
  remind_date: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
};

type Props = {
  todo: TodoType;
  todos: TodoType[];
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>;
};

const Todo = ({ todo, todos, setTodos }: Props) => {
  const [isPinned, setIsPinned] = useState<boolean>(todo.pinned);
  const [isChecked, setIsChecked] = useState<boolean>(todo.completed);
  const [isOpen, setIsOpen] = useState(false);

  const isRemindDatePassed = new Date(todo.remind_date) < new Date();

  const formatRemindDate = (remindDate: Date) => {
    if (isRemindDatePassed) {
      return formatDistanceToNow(new Date(todo.remind_date), {
        addSuffix: true,
      });
    } else if (isToday(remindDate)) {
      return "today";
    } else if (isTomorrow(remindDate)) {
      return "tomorrow";
    } else if (isThisWeek(remindDate)) {
      return format(remindDate, "EEEE");
    } else {
      return format(remindDate, "dd/MM/yyyy");
    }
  };

  return (
    <div
      key={todo.id}
      // draggable={true}s
      className={[
        "shrink-0 border-[0.7px] p-3 rounded-xl flex justify-between  overflow-clip",
        isPinned && "bg-secondary",
        isChecked &&
          !todo.completed &&
          "delay-1000 translate-x-48 duration-700 transition-all",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-start gap-2 flex-auto",
          isChecked &&
            !todo.completed &&
            "delay-1000 translate-x-48 duration-700 transition-all",
        ].join(" ")}
      >
        <Checkbox
          className={"accent-foreground flex-initial"}
          checked={isChecked}
          onCheckedChange={async () => {
            const mappedTodos = todos.map((tdo) => {
              if (tdo.id == todo.id) {
                return {
                  ...tdo,
                  completed: !tdo.completed,
                  pinned: false,
                };
              }
              return tdo;
            });
            if (!todo.completed) {
              setTimeout(() => setTodos(() => mappedTodos), 1200);
            } else {
              setTodos(() => mappedTodos);
            }
            setIsChecked(!isChecked);
            await axios.put(
              `https://todo-app-avvn.onrender.com/todos/${todo.id}`,
              {
                completed: !todo.completed,
              }
            );
          }}
          name="todo"
        />
        <div
          className={[
            "flex flex-col flex-auto gap-2",
            !todo.completed && "cursor-pointer",
          ].join(" ")}
          onClick={() => {
            if (todo.completed) return;
            setIsOpen(true);
          }}
        >
          <p
            className={[
              "text-foreground flex-auto leading-none",
              isChecked && "line-through",
            ].join(" ")}
            key={todo.id}
          >
            {todo.title}
          </p>
          {!todo.completed && todo.remind_date && (
            <div
              className={[
                "flex items-center gap-[3px] text-xs",
                isRemindDatePassed && "text-red-500",
              ].join(" ")}
            >
              <Calendar size={12} />
              <p className="leading-none">
                {formatRemindDate(new Date(todo.remind_date))}
              </p>
            </div>
          )}
        </div>
      </div>
      <EditTodoDialog
        todo={todo}
        todos={todos}
        setTodos={setTodos}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div>
        <Star
          size={15}
          className={[
            "flex-initial cursor-pointer mt-[1px]",
            isChecked
              ? "hidden"
              : isPinned
              ? "text-yellow-500 fill-yellow-500  hover:text-yellow-600 hover:fill-yellow-600"
              : "text-foreground/50  hover:text-foreground/90",
          ].join(" ")}
          onClick={() => {
            axios.put(`https://todo-app-avvn.onrender.com/todos/${todo.id}`, {
              pinned: !todo.pinned,
            });
            const mapTodos = todos.map((tdo) => {
              if (tdo.id == todo.id) {
                return {
                  ...tdo,
                  pinned: !tdo.pinned,
                };
              }
              return tdo;
            });
            setTodos(mapTodos);
            setIsPinned(!isPinned);
          }}
        />
      </div>
    </div>
  );
};

export default Todo;
