import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Complaint } from './entities/complaint.entity';
import { CreateComplaintDto } from './dto/create-complaint';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private readonly repository: Repository<Complaint>
  ) {}

  async create({ user_id, ...data }: CreateComplaintDto) {
    console.log(user_id, data);

    const complaint = this.repository.create({
      ...data,
      user: { id: user_id }
    });

    await this.repository.save(complaint);

    return complaint;
  }

  async findAll() {
    const output = await this.repository.find();

    return output;
  }

  async findByUser(id: string) {
    const output = await this.repository.findBy({ user: { id } });

    return output;
  }

  async uploadImages(complaintId: string, files: Express.Multer.File[]) {
    const complaint = await this.repository.findOneBy({ id: complaintId });

    if (!complaint) throw new NotFoundException();

    complaint.images = files.map((e) => e.filename);

    await this.repository.save(complaint);
  }
}
