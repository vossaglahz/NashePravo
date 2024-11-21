import { AboutThePlatform } from '../../components/HomePageComponents/AboutThePlatform/AboutThePlatform';
import { FeedBackForm } from '../../components/HomePageComponents/FeedBackForm/FeedBackForm';
import { ForWhoPage } from '../../components/HomePageComponents/ForWhoPage/ForWhoPage';
import { RunningText } from '../../components/HomePageComponents/ForWhoPage/RunningText';
import { PromoBlock } from '../../components/HomePageComponents/PromoBlock/PromoBlock';
import './MainPage.scss';
import { RobotLink } from '../../components/HomePageComponents/RobotLink/RobotLink';

export const MainPage = () => {
    return (
        <div className="main-wrap">
            <RobotLink />
            <PromoBlock />
            <RunningText />
            <AboutThePlatform />
            <ForWhoPage />
            <FeedBackForm />
        </div>
    );
};
