import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

type TAlert = {
    isError: boolean;
    text: string;
    status: 'error' | 'info' | 'success' | 'warning';
};

export const AlertComponent = ({ isError, text, status }: TAlert) => {
    const [open, setOpen] = useState(isError);

    useEffect(() => {
        if (isError) {
            setOpen(true);
            const timer = setTimeout(() => {
                setOpen(false);
            }, 1500);

            return () => clearTimeout(timer);
        } else {
            setOpen(false);
        }
    }, [isError]);

    return (
        <Snackbar open={open} autoHideDuration={2000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert severity={status} sx={{ width: '100%' }}>
                {text}
            </Alert>
        </Snackbar>
    );
};
