import { useState } from "react";
import "./Todo.scss";
import { Box, Button, Input, Modal } from "@mui/material";
import { useCreateTodoMutation, useGetTodoQuery, useEditStatusMutation, useDeleteTodoMutation } from "../../store/api/todo.api";
import { DndProvider, } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TodoColumn } from "./components/TodoColumn/TodoColumn";
import { useTranslation } from "react-i18next";

export const Status = {
    doing: 'Doing',
    process: 'Process',
    done: 'Done',
}

export type StatusType = typeof Status[keyof typeof Status];

export interface TodoItem {
    id: string;
    text: string;
    status: StatusType;
    createdAt: string;
}





export const Todo = () => {
    const { t } = useTranslation();
    const [todoCreate] = useCreateTodoMutation();
    const [updateTodo] = useEditStatusMutation();
    const [deleteTodo] = useDeleteTodoMutation()
    const [text, setText] = useState<string>("");
    const { data, refetch } = useGetTodoQuery('');
    const [modal, setModal] = useState<boolean>(false);

    const onClick = () => {
        setModal(true);
    };

    const send = () => {
        todoCreate({ text }).unwrap().then(refetch);
        setModal(false);
        setText("");
    };

    const handleDrop = (item: { id: string; status: StatusType }, newStatus: StatusType) => {
        updateTodo({ id: item.id, status: newStatus }).unwrap().then(refetch);
    };


    const deleteTodoHandler = (id:string) => {
        console.log(id);
        deleteTodo(id).unwrap().then(refetch)
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <Modal open={modal} onClose={() => setModal(false)}>
                <Box className="modalCreate">
                    <span>{t('List.todo.createNote')}</span>
                    <Input
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                        placeholder={t('List.todo.placehold')}
                        type="text"
                    />
                    <Button onClick={send} variant="outlined">{t('List.todo.add')}</Button>
                </Box>
            </Modal>
            <div className="buttonTodo">
                <Button variant="outlined" onClick={onClick}>{t('List.todo.create')}</Button>
            </div>
            <div className="todo">
                {Object.values(Status).map((status) => (
                    <TodoColumn key={status} status={status} data={data} onDrop={handleDrop} onDeleteTodo={deleteTodoHandler} />
                ))}
            </div>
        </DndProvider>
    );
};


