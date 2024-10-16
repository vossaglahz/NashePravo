import { Footer } from '../../Footer/Footer';
import { Header } from '../../Header/Header';
import { matchPath, Outlet, useLocation } from 'react-router-dom';
import './layout.scss';

export function Layout() {
    const {pathname} = useLocation();
    const isChatPage = pathname === "/chat" || matchPath("/chat/:id", pathname);
    
    return (
        <>
            <Header />
            <Outlet />
            {!isChatPage && <Footer />}
        </>
    );
}
