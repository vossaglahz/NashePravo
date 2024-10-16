import { Outlet } from "react-router-dom"
import { UserCard } from "./components/userCard/userCard"
import "./Chat.scss"
import { useEffect } from "react"
import { socket } from "../../store/socket/socket"
export const Chat = () => {

    useEffect(() => {
        socket.emit('connection')
        socket.on('message', (message) => {
            console.log(message);
        })
},[socket])

    return (
        <div className="container">
            <div className="containerChat">
                <div className="userHistory">
                <UserCard fullname={"Mac (user 1)"} id={"1"}/>
                    <UserCard fullname={"Kenton (user 2)"} id={"2"}/>
                </div>
                <Outlet/>
            </div>
        </div>
    )
}
