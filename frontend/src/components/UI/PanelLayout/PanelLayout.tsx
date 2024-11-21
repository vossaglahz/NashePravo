import { Outlet } from 'react-router-dom';
import { Header } from '../../Header/Header';
import './PanelLayout.scss';
import { PanelAside } from '../../PanelAside/PanelAside';
import { useAppSelector } from '../../../store/store';
import { Loader } from '../Loader/Loader';

export const PanelLayout = () => {
    const {isLoading} = useAppSelector(state => state.users)


    return (
        <div className="panelLayout">
            <Header />
            <div className="container">
                <div className="panel__wrapper">
                    <PanelAside />
                    <div className="panel__outlet">
                        {
                            isLoading?<Loader/>:<Outlet />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};
