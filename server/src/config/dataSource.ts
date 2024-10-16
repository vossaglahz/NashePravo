import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'esdp',
    schema: 'esdp',
    synchronize: true,
    entities: ['src/entities/*{.js,.ts}'],
    seeds: ['src/database/seeds/*{.js,.ts}'],
    factories: ['src/database/factories/*{.js,.ts}']
};

export const AppDataSource = new DataSource(options);
