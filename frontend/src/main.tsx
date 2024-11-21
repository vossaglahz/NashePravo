import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store.ts';
import App from './App.tsx';
import './i18n.ts';
import './index.scss';
import './components/Adaptive/_desktop.scss';
import './components/Adaptive/_tablet.scss';
import './components/Adaptive/_mobile.scss';

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
);
