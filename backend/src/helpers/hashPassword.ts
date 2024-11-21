import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
};
