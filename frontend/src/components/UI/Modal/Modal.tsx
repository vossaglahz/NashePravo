import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

const style = {
    color: 'black',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

interface ModalComponentProps {
    topic: string;
    content: string;
    open: boolean;
    sourceLink: string | null;
    onClose: () => void;
}

export default function ModalComponent({ topic, content, open, onClose, sourceLink }: ModalComponentProps) {
    const { t } = useTranslation();
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box className="box__modal" sx={style}>
                    <Typography style={{ wordBreak: 'break-word' }} id="transition-modal-title" variant="h6" component="h2">
                        {topic}
                    </Typography>
                    <Typography style={{ wordBreak: 'break-word' }} id="transition-modal-description" sx={{ mt: 2 }}>
                        {content}
                    </Typography>
                    {typeof sourceLink === 'string' && (
                        <Typography style={{ wordBreak: 'break-word' }} id="transition-modal-description" sx={{ mt: 2 }}>
                            <a className='sourceLink' href={sourceLink}>➡️ перейти к источнику ⬅️</a>
                        </Typography>
                        
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={onClose}>{t('Modal')}</Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
}
