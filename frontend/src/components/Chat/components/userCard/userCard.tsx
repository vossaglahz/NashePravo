import { NavLink } from "react-router-dom"
import "./userCard.scss"
import { useTranslation } from "react-i18next"

interface IProps {
    fullname: string
    image?: string
    id?: string
    status: 'online' | 'offline',
    className?: string
}

export const UserCard = (props:IProps) => {
    const { t } = useTranslation();
    return (
        <NavLink className={props.className?`userCard $${props.className}`:"userCard"} to={`/chat/${props.id}`}>
            <img className="userCard__img" src={props.image?"":`${import.meta.env.VITE_API_BASE_URL}/static/no-image.png`} alt="imageUsers" />
            <h3 className="userCard__title">{props.fullname}</h3>
            <p className={`userCard__status ${props.status}`}>
                {props.status === 'online' ? t('Chat.online') : t('Chat.offline')}
            </p>
        </NavLink>
    )
}
