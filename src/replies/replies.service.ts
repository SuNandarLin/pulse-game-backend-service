import { Injectable } from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RepliesService {
  constructor(private prisma: PrismaService) {}
  create(createReplyDto: CreateReplyDto) {
    return this.prisma.reply.create({ data: createReplyDto });
  }

  findAll() {
    return this.prisma.reply.findMany({
      include: {
        user: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.reply.findUnique({ where: { id } });
  }

  update(id: number, updateReplyDto: UpdateReplyDto) {
    return this.prisma.reply.update({
      where: { id },
      data: updateReplyDto,
    });
  }

  updateVote(id: number) {
    return this.prisma.reply.update({
      where: { id },
      data: {
        vote: {
          increment: 1,
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.reply.delete({ where: { id } });
  }
}
