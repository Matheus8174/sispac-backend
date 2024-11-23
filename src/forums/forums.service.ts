import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Forum } from './entities/forum.entity';
import { CreateForumDto } from './dto/create-forum.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class ForumsService {
  constructor(
    @InjectRepository(Forum)
    private readonly repository: Repository<Forum>,
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>
  ) {}

  async create({ tags, userId, cityId, ...rest }: CreateForumDto) {
    const cityExists = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${cityId}`
    );

    const { id } = await cityExists.json();

    if (!id) throw new NotFoundException('city not exists');

    const forum = this.repository.create({
      owner: { id: userId },
      tags: tags.map((tag) => ({ name: tag })),
      cityId,
      ...rest
    });

    await this.repository.save(forum);

    return forum;
  }

  async findByTags(tags: string[]) {
    const output = await this.repository.find({
      where: {
        tags: { name: In(tags) }
      },
      order: { createdAt: 'ASC' },
      relations: {
        tags: true
      }
    });

    return output;
  }

  async findAll() {
    const output = await this.repository.find();

    return output;
  }

  async findByCity(cityId: string) {
    const output = await this.repository.find({
      where: { cityId },
      relations: {
        comments: true,
        tags: true,
        favoritedBy: true
      }
    });

    return output;
  }

  async findAllTags() {
    const output = await this.tagsRepository.find();

    return output;
  }

  async findOne(id: string) {
    const output = await this.repository.findOne({
      where: { id },
      relations: {
        tags: true,
        comments: true,
        owner: true
      }
    });

    return output;
  }
}
