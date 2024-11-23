import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { Tag, forumTags } from '@/forums/entities/tag.entity';

class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Tag);

    await repository.insert(forumTags.map((tag) => ({ name: tag })));
  }
}

export default MainSeeder;
