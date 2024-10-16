import { Link } from 'react-router-dom';
import { PiKeyLight } from 'react-icons/pi';
import { IoIosArrowForward } from 'react-icons/io';
import { MdOutlineLockReset } from 'react-icons/md';
import './Security.scss';

export const Security = () => {
    return (
        <>
            <div className="security">
                <li>
                    <Link to={'/'}>
                        <div>
                            <PiKeyLight />
                            Пароль
                        </div>
                        <div>
                            <IoIosArrowForward />
                        </div>
                    </Link>
                </li>
            </div>
            <br />
            <div className="security">
                <li>
                    <Link to={'/'}>
                        <div>
                            <MdOutlineLockReset />
                            Восстановить пароль
                        </div>
                        <div>
                            <IoIosArrowForward />
                        </div>
                    </Link>
                </li>
            </div>
        </>
    );
};
