import { Outlet } from 'react-router-dom';
import { Header } from '../../Header/Header';
import './PanelLayout.scss';
import { PanelAside } from '../../PanelAside/PanelAside';

export const PanelLayout = () => {
    return (
        <div className="panelLayout">
            <Header />
            <div className="container">
                <div className="panel__wrapper">
                    <PanelAside />
                    <div className="panel__outlet">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};
