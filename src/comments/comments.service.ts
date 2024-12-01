import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}
  create(createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({ 
      data: createCommentDto,
      include: {
        user: true
      }
    });
  }

  findAll() {
    return this.prisma.comment.findMany({
      include: {
        user: true,
        replies: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  updateVote(id: number) {
    return this.prisma.comment.update({
      where: { id },
      data: {
        vote: {
          increment: 1,
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
