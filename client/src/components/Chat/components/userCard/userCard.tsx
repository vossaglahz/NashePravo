import { NavLink } from "react-router-dom"
import "./userCard.scss"

interface IProps {
    fullname: string
    image?: string
    id?: string
}

export const UserCard = (props:IProps) => {
    return (
        <NavLink className="userCard" to={`/chat/${props.id}`}>
            <img className="userCard__img" src={props.image?"":"/public/no-image.png"} alt="imageUsers" />
            <h3 className="userCard__title">{props.fullname}</h3>
        </NavLink>
    )
}
