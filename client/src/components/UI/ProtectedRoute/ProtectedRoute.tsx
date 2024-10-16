import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ILawyer } from '../../../interfaces/Lawyer.interface';
import { IUser } from '../../../interfaces/User.interface';

type TProps = {
    client?: IUser | ILawyer | null;
    children: ReactNode;
};

export const ProtectedRoute = ({ client, children }: TProps) => {
    if (!client) {
        return <Navigate to="/login" />;
    }
    return children;
};
