import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

import { dataSourceOptions } from '../database/data-source';

const dataSource = new DataSource(dataSourceOptions);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);

  await runSeeders(dataSource);

  process.exit();
});
