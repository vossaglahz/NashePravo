import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ILawyer } from '../../../interfaces/Lawyer.interface';
import { IUser } from '../../../interfaces/User.interface';

type TProps = {
    client: IUser | ILawyer;
    children: ReactNode;
};

export const ProtectedRoute = ({ client, children }: TProps) => {
    if (!client.refreshToken) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

export const ProtectedRouteAdmin = ({ client, children }: TProps) => {
    if (client.role !== "admin") {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

export const ProtectedRouteLawyerEmail = ({ client, children }: TProps) => {
    if (client.isActivatedByEmail === false) {
        return <Navigate to="/activate" />;
    }

    return <>{children}</>;
};