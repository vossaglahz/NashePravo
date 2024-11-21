import { PersonalNotification } from '@/entities/personalNotification.entity';
import { setSeederFactory } from 'typeorm-extension';
import { User } from '@/entities/user.entity';
import { AppDataSource } from '@/config/dataSource';
import { Lawyer } from '@/entities/lawyers.entity';

export const PersonalNotificationFactory = setSeederFactory(PersonalNotification, async faker => {
    const users = await AppDataSource.getRepository(User).find();
    const lawyers = await AppDataSource.getRepository(Lawyer).find();

    const shouldUseUser = faker.datatype.boolean();

    const personalNotification = new PersonalNotification();
    personalNotification.topic = faker.lorem.words(3);
    personalNotification.content = faker.lorem.paragraph();
    personalNotification.answered = false;
    personalNotification.role = shouldUseUser ? users[0].role : lawyers[0].role;
    personalNotification.sourceLink = faker.image.url();
    
    const pastDate = faker.date.past({ years: 10 });
    personalNotification.createdAt = pastDate;

    if (shouldUseUser) {
        const user = faker.helpers.arrayElement(users);
        personalNotification.user = user.id;
        personalNotification.toAdmin = user.role !== 'admin';
    } else {
        const lawyer = faker.helpers.arrayElement(lawyers);
        personalNotification.lawyer = lawyer.id;
        personalNotification.toAdmin = true;
    }

    return personalNotification;
});
