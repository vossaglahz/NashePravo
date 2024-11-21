import { GeneralNotifications } from '@/entities/generalNotification.entity';
import { setSeederFactory } from 'typeorm-extension';

export const GeneralNotificationFactory = setSeederFactory(GeneralNotifications, async faker => {
    const generalNotification = new GeneralNotifications();
    generalNotification.topic = faker.lorem.words(3);
    generalNotification.content = faker.lorem.paragraph();
    generalNotification.important = false;
    generalNotification.role = "all";
    generalNotification.sourceLink = faker.image.url();
    
    const pastDate = faker.date.past({ years: 10 });
    generalNotification.createdAt = pastDate;

    return generalNotification;
});
