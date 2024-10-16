import { useState } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import './Notifications.scss';
import { GeneralNotifications } from "./NotificationType/GeneralNotofcations";
import { PrivateNotifications } from "./NotificationType/PrivateNotifications";

export const Notifications = () => {
    const [isPrivate, setIsPrivate] = useState<string>('public');

    const handleChange = (event: SelectChangeEvent) => {
        setIsPrivate(event.target.value as string);
    };

    return <>
    <div className="filter">
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth className="typebox">
                    <InputLabel id="demo-simple-select-label">тип</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={isPrivate}
                        label="Age"
                        onChange={handleChange}
                    >
                        <MenuItem value='public'>публичный</MenuItem>
                        <MenuItem value='private'>личные</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </div>
        {isPrivate === 'public' ? <GeneralNotifications /> : <PrivateNotifications />}
    </>
}