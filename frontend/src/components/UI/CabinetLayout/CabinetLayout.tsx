import { Outlet } from 'react-router-dom';
import { Header } from '../../Header/Header';
import { CabinetAside } from '../../CabinetAside/CabinetAside';
import './CabinetLayout.scss';
import { useAppSelector } from '../../../store/store';
import { Loader } from '../Loader/Loader';

export const CabinetLayout = () => {
    const {isLoading} = useAppSelector(state => state.users)

    return (
        <div className="cabinetLayout">
            <Header />
            <div className="container">
                <div className="cabinet__wrapper">
                    <CabinetAside />
                    <div className="cabinet__outlet">
                        {
                            isLoading?<Loader/>:<Outlet />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};
