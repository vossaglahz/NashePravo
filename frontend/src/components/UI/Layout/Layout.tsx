import { Footer } from '../../Footer/Footer';
import { Header } from '../../Header/Header';
import { matchPath, Outlet, useLocation } from 'react-router-dom';
import './Layout.scss';
import { Loader } from '../Loader/Loader';
import { useAppSelector } from '../../../store/store';

export function Layout() {
    const { pathname } = useLocation();
    const { isLoading } = useAppSelector(state => state.users);
    const isChatPage = pathname === '/chat' || matchPath('/chat/:id', pathname);
    const isChatAI = pathname === '/intellectual-robot';

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <Header />
                    <Outlet />
                    {!isChatPage && !isChatAI && <Footer />}
                </>
            )}
        </>
    );
}
