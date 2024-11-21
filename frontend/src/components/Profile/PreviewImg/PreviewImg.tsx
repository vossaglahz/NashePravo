import { BsFiletypePdf } from 'react-icons/bs';
import { Button } from '@mui/material';
import './PreviewImg.scss';

type TState = {
    src: string | undefined;
    name: string;
    onDelete: () => void;
};

export const PreviewImg = ({ src, name, onDelete }: TState) => {
    const isLocalFile = src?.includes('blob');
    const documentUrl = isLocalFile ? src : `${import.meta.env.VITE_API_BASE_URL}/uploads/${src}`;

    return (
        <div className="previewImg" title={name}>
            {src ? (
                <a target="_blank" href={documentUrl} rel="noopener noreferrer">
                    <BsFiletypePdf />
                </a>
            ) : (
                <span>Файл недоступен</span>
            )}
            <a className="previewImg__name" target="_blank" href={documentUrl}>
                {name}
            </a>
            <Button onClick={onDelete} variant="outlined" color="error">
                Удалить
            </Button>
        </div>
    );
};
