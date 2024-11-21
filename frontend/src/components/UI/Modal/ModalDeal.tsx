import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
    color: 'black',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: "12px"
};

const getTypeSet = (status: string) => {
    switch (status) {
        case 'Civil':
            return { color: '#008d42', text: "Гражданский" };
        case 'Corporate':
            return { color: '#38a0dc', text: "Корпоративный" };
        case 'Criminal':
            return { color: '#a4b600', text: "Уголовный" };
        default:
            return { color: 'black' };
    }
};

interface ModalComponentProps {
    title: string;
    type: string;
    description: string;
    username?: string;
    usersurname?: string;
    city: string;
    price: number;
    open: boolean;
    onClose: () => void;
}

export default function ModalDealComponent({ title, type, description, username, usersurname, city, price, open, onClose }: ModalComponentProps) {
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
                <Box sx={style}>
                    <Typography style={{ wordBreak: 'break-word' }} id="transition-modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                    {(() => {
                    const { color, text } = getTypeSet(type);
                    return (
                        <Typography sx={{ color, fontSize: 16 }} key={type}>
                            {text}
                        </Typography>
                    );
                    })()}
                    <Typography style={{ wordBreak: 'break-word' }} id="transition-modal-description" sx={{ mt: 2 }}>
                        {description}
                    </Typography>
                    <Typography style={{ wordBreak: 'break-word' }} id="transition-modal-description" sx={{ mt: 2 , color: "#4C75A3"}}>
                        Человек: {username} {usersurname}
                    </Typography>
                    <Typography style={{ wordBreak: 'break-word' }} id="transition-modal-description" sx={{ mt: 2 }}>
                        {city}
                    </Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: "green" }}>
                        {price}₸
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={onClose}>Закрыть</Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
}
