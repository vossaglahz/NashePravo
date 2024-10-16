import { AboutThePlatform } from '../../components/HomePageComponents/AboutThePlatform/AboutThePlatform';
import { FeedBackForm } from '../../components/HomePageComponents/FeedBackForm/FeedBackForm';
import { ForWhoPage } from '../../components/HomePageComponents/ForWhoPage/ForWhoPage';
import { RunningText } from '../../components/HomePageComponents/ForWhoPage/RunningText';
import { PromoBlock } from '../../components/HomePageComponents/PromoBlock/PromoBlock';

export const MainPage = () => {
    return (
        <>
            <PromoBlock />
            <AboutThePlatform />
            <RunningText />
            <ForWhoPage />
            <FeedBackForm />
        </>
    );
};
