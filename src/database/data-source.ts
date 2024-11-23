import type { DataSourceOptions } from 'typeorm';
import type { SeederOptions } from 'typeorm-extension';
import MainSeeder from './main.seeder';

import path from 'node:path';

const entities = path.join(__dirname, '..', '/**/*.entity.{js,ts}');

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [entities],
  synchronize: true,
  seeds: [MainSeeder]
};
