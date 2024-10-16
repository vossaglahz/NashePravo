import { Outlet } from 'react-router-dom';
import { Header } from '../../Header/Header';
import { CabinetAside } from '../../CabinetAside/CabinetAside';
import './CabinetLayout.scss';

export const CabinetLayout = () => {
    return (
        <div className="cabinetLayout">
            <Header />
            <div className="container">
                <div className="cabinet__wrapper">
                    <CabinetAside />
                    <div className="cabinet__outlet">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};
