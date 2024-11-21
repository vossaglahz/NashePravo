import { useEffect, useRef, useState } from 'react';
import { IoArrowUpCircleOutline } from "react-icons/io5";
import './IntellectualRobot.scss';
import { Container } from '@mui/material';
import { BsTrash3 } from "react-icons/bs";
import { ChatMessageCard } from './MessageCard/ChatMessageCard';
import { useMessageOpenAiMutation } from '../../store/api/openAI.api';
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { HiOutlineDocumentRemove } from "react-icons/hi";
import { useTranslation } from 'react-i18next';


interface Message {
    content: string;
    role: string;
}

export const IntellectualRobot = () => {
    const { t } = useTranslation();
    const [message, setMessage] = useState<Message>({ content: '', role: '' });
    const [doc, setDoc] = useState<File | null>(null);
    const [docType, setDocType] = useState<boolean>(false);
    const [messageType, setMessageType] = useState<string | null>(null);
    const [typeValue, setTypeValue] = useState(false);

    const [messages, setMessages] = useState<Message[] | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [messageOpenAi, { isLoading }] = useMessageOpenAiMutation();

    const inputRefDoc = useRef<HTMLInputElement>(null);
    const onFileChangeDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setDoc(file);
            setDocType(true);
        } 
    };

    const onDeleteDoc = () => {
        setDoc(null);
        setDocType(false);
        if (inputRefDoc.current) {
            inputRefDoc.current.value = '';
        }
    };
    
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }

    }, [message]);

    useEffect(() => {
        if (messageType) setTypeValue(true);
        if (!messageType) setTypeValue(false);
        console.log(messageType);
    }, [messageType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!message.content.trim()) return;
    
        setMessages(messages ? [...messages, message] : [message]);
    
        const formData = new FormData();
        if (doc) {
            formData.append('document', doc);
        }
    
        formData.append('message', message.content);
        formData.append('role', message.role);

        if(messageType) {
            formData.append('type', messageType);
        }
    
        try {
            console.log(t('Robot.send'), Object.fromEntries(formData.entries()));
    
            const messageData = await messageOpenAi(formData); 
             
            if (messageData) {
                const systemMessage: Message = { content: messageData.data.responseMessage, role: 'system' };
                setMessages(prevMessages => [...(prevMessages || []), systemMessage]);
            }

            setMessage({ content: '', role: '' });
            setDoc(null);
        } catch (error) {
            console.error(t('Robot.sendError'), error);
        }
    };

    const cleanHandleSubmit = () => {
        setMessages(null);
        setMessage({ content: '', role: '' });
        setMessageType(null);
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <>
            <Container>
                <div className="chat-wrapper">
                    <div className="messages">
                        {!messages && (
                            <div className="message-сard">
                                <ChatMessageCard img={`${import.meta.env.VITE_API_BASE_URL}/static/robot-mini.svg`} message={t('Robot.howToHelp')} />
                            </div>
                        )}
                        {messages && messages.map((message, index) => (
                            <div className="message-сard" key={index} style={{ justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                {message.role === 'user' ? (<ChatMessageCard message={message.content} />) : (<ChatMessageCard img={`${import.meta.env.VITE_API_BASE_URL}/static/robot-mini.svg`} message={message.content} />)}
                            </div>
                        ))}
                        {isLoading ? (<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>) : <></>}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="robot-chat-form" onSubmit={handleSubmit}>
                        <div className="services-types">
                            <button className={`services-type-item ${messageType === t('Robot.family') ? 'selected' : ''}`} onClick={() => setMessageType(messageType === t('Robot.family') ? null : t('Robot.family'))}>{t('Robot.family')}</button>
                            <button className={`services-type-item ${messageType === t('Robot.medical') ? 'selected' : ''}`} onClick={() => setMessageType(messageType === t('Robot.medical') ? null : t('Robot.medical'))}>{t('Robot.medical')}</button>
                            <button className={`services-type-item ${messageType === t('Robot.educate') ? 'selected' : ''}`} onClick={() => setMessageType(messageType === t('Robot.educate') ? null : t('Robot.educate'))}>{t('Robot.educate')}</button>
                            <button className={`services-type-item ${messageType === t('Robot.employment') ? 'selected' : ''}`} onClick={() => setMessageType(messageType === t('Robot.employment') ? null : t('Robot.employment'))}>{t('Robot.employment')}</button>
                            <button className={`services-type-item ${messageType === t('Robot.social') ? 'selected' : ''}`} onClick={() => setMessageType(messageType === t('Robot.social') ? null : t('Robot.social'))}>{t('Robot.social')}</button>
                            <button className={`services-type-item ${messageType === t('Robot.migration') ? 'selected' : ''}`} onClick={() => setMessageType(messageType === t('Robot.migration') ? null : t('Robot.migration'))}>{t('Robot.migration')}</button>
                            <button className={`services-type-item ${messageType === t('Robot.estate') ? 'selected' : ''}`} onClick={() => setMessageType(messageType === t('Robot.estate') ? null : t('Robot.estate'))}>{t('Robot.estate')}</button>
                            <button className={`services-type-item ${messageType === t('Robot.custom') ? 'selected' : ''}`} onClick={() => setMessageType(messageType === t('Robot.custom') ? null : t('Robot.custom'))}>{t('Robot.custom')}</button>
                            <button className={`services-type-item ${messageType === t('Robot.lawHelp') ? 'selected' : ''}`} onClick={() => setMessageType(messageType === t('Robot.lawHelp') ? null : t('Robot.lawHelp'))}>{t('Robot.lawHelp')}</button>
                            <button className={`services-type-item ${messageType === t('Robot.transport') ? 'selected' : ''}`} onClick={() => setMessageType(messageType === t('Robot.transport') ? null : t('Robot.transport'))}>{t('Robot.transport')}</button>
                        </div>
                        <div className="input-block">
                            <div className="input-wrap">
                            <div className="docBg">
                                <input
                                    ref={inputRefDoc}
                                    type="file"
                                    onChange={onFileChangeDocument}
                                    name="documents"
                                    style={{ display: 'none' }}
                                    accept=".pdf"
                                />
                                {docType == true ? (
                                    <div className="docPreview">
                                        <button
                                            type="button"
                                            onClick={onDeleteDoc}
                                            className="docBtn"
                                        >
                                           <HiOutlineDocumentRemove size={45} color="#9C0000"  />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => inputRefDoc.current?.click()}
                                        className="docBtn"
                                    >
                                        <HiOutlineDocumentDownload  size={45} color="#4C75A3" />
                                    </button>
                                )}
                                </div>
                                <textarea
                                    disabled={!typeValue}
                                    ref={textareaRef}
                                    value={message.content}
                                    className='textAI'
                                    onChange={e => setMessage({ content: e.target.value, role: 'user' })}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e);
                                        }
                                    }}
                                    placeholder={t('Robot.questType')}
                                    rows={1}
                                />
                                <button className="chat-form__button" type="submit" disabled={isLoading} >
                                    <IoArrowUpCircleOutline size={45} color="#4C75A3"/>
                                </button>
                            </div>
                            <button className="chat-clean__button" type="submit">
                                <BsTrash3 size={35} color="#4C75A3" onClick={cleanHandleSubmit} />
                            </button>
                        </div>
                    </form>
                </div>
            </Container>
        </>
    );
};
