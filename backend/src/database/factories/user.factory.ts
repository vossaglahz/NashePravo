import { User } from '@/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { hashPassword } from '@/helpers/hashPassword';
import { v4 as uuidv4 } from 'uuid';
import { generateAccessToken, generateRefreshToken } from '@/helpers/jwtTokens';
import { UserRoles } from '@/interfaces/IUser.inerface';

export const UserFactory = setSeederFactory(User, async () => {
    const user = new User();
    user.name = faker.person.firstName();
    user.surname = faker.person.lastName();
    user.email = faker.internet.email();
    user.password = await hashPassword('123456');
    user.isActivatedByEmail = faker.datatype.boolean();
    user.activationLink = uuidv4();
    user.role = UserRoles.user;

    const refreshTokenObj = await generateRefreshToken({ role: user.role });
    const accessTokenObj = await generateAccessToken({ role: user.role });

    user.refreshToken = refreshTokenObj.refreshToken;
    user.accessToken = accessTokenObj.accessToken;
    return user;
});