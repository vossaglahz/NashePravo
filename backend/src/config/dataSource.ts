import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost', // 'localhost' for local dev
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'esdp',
    schema: 'esdp',
    synchronize: true,
    entities: ['src/entities/*{.js,.ts}'],
    seeds: ['src/database/seeds/*{.js,.ts}'],
    factories: ['src/database/factories/*{.js,.ts}']
};

export const AppDataSource = new DataSource(options);
