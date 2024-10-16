import { Button } from '@mui/material';
import './PreviewImg.scss';

type TState = {
    src: string;
    onDelete: VoidFunction;
};

export const PreviewImg = ({ src, onDelete }: TState) => {
    return (
        <div className="previewImg">
            <img className="profile__docs-preview" src={src.includes('blob') ? src : `http://localhost:8000/uploads/${src}`} alt="previewImg" />
            <Button onClick={onDelete} variant="outlined" color="error">
                Удалить
            </Button>
        </div>
    );
};
