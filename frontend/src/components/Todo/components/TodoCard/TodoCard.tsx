import { useDrag } from "react-dnd";
import { Status, TodoItem } from "../../Todo";
import { Button } from "@mui/material";
import { getStatusTranslation } from "../TodoColumn/TodoColumn";
import { useTranslation } from "react-i18next";


interface TodoCardProps {
    todo: TodoItem;
    deleteTodo: (id:string) => void
}

export const TodoCard = ({ todo, deleteTodo }: TodoCardProps) => {
    const [{ isDragging }, drag] = useDrag({
        type: "TODO",
        item: { id: todo.id, status: todo.status },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const { t } = useTranslation();
    
    return (
        <div ref={drag} className={`todo__card ${isDragging ? "dragging" : ""}`}>
            
            <h3>{todo.text}</h3>
            <p style={{color:todo.status===Status.done?"green":todo.status===Status.doing?"red":"blue"}}>{getStatusTranslation(todo.status, t)}</p>
            <span>{new Date(todo.createdAt).toLocaleString()}</span>
            {/* {
                todo.status=== Status.done?<div></div>:""
            } */}
            <div>
            <Button  size="small" color="error" variant="outlined" onClick={() => deleteTodo(todo.id)}>{t('List.todo.delete')}</Button>

            </div>
        </div>
    );
};
