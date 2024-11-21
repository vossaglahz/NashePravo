import { useDrop } from "react-dnd";
import { StatusType, TodoItem } from "../../Todo";
import { TodoCard } from "../TodoCard/TodoCard";
import { useTranslation } from "react-i18next";

interface TodoColumnProps {
    status: StatusType;
    data: TodoItem[] | undefined;
    onDrop: (item: { id: string; status: StatusType }, newStatus: StatusType) => void;
    onDeleteTodo: (id: string) => void;
}

export const getStatusTranslation = (status: StatusType, t: (key: string) => string): string => {
    switch (status) {
        case "Doing":
            return t("Status.doing");
        case "Process":
            return t("Status.process");
        case "Done":
            return t("Status.done");
        default:
            return status;
    }
};

export const TodoColumn = ({ status, data, onDrop, onDeleteTodo }: TodoColumnProps) => {
    const { t } = useTranslation();
    
    const [{ isOver }, drop] = useDrop({
        accept: "TODO",
        drop: (item: { id: string; status: StatusType }) => onDrop(item, status),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });
    return (
        <div ref={drop} className={`todo__block ${isOver ? "highlight" : ""}`}>
            <h1>{getStatusTranslation(status, t)}</h1>
            <div className="todo__CardBlock">
                {data?.filter((todo) => todo.status === status).map((todo) => (
                    <TodoCard key={todo.id} todo={todo} deleteTodo={onDeleteTodo} />
                ))}
            </div>
        </div>
    );
};
