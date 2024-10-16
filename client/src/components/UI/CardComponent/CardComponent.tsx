import { Card, CardContent, Typography } from '@mui/material';
import './CardComponent.scss';

interface State {
    title: string;
    description: string;
    className: string;
    titleClassName: string;
    descriptionClassName: string;
}

export const CardComponent = ({ title, description, className, titleClassName, descriptionClassName }: State) => {
    return (
        <Card className={className}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" className={titleClassName}>
                    {title}
                </Typography>
                <Typography variant="body2" className={descriptionClassName}>
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
};
