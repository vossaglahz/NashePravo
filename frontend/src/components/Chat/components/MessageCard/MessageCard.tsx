import { useTranslation } from "react-i18next"
import "./MessageCard.scss"

interface IProps {
    image?:string
    fullName: string
    message:string
    date:string
}

export const MessageCard = (props:IProps) => {
    const { t } = useTranslation();
    
    return (
        <div className="messageCard"   style={{
                flexDirection: props.fullName !== t('Chat.you') ? "row-reverse" : "row"
            }}>
            <div className="messageCard__text">
                <h4 className="messageCard__name">{props.fullName}</h4>
                <span className="messageCard__time">{props.date}</span>
                <p className="messageCard__message">{props.message}</p>
            </div>
            <img className="messageCard__img" src={props.image?props.image:`${import.meta.env.VITE_API_BASE_URL}/static/empty-box.png`} alt="imageUsers" />
        </div>
    )
}
