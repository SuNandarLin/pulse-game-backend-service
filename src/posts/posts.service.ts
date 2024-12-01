import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}
  create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({ data: createPostDto });
  }

  async findAll(current_user_id: number) {
    const posts = await this.prisma.post.findMany({
      include: {
        comments: {
          include: {
            user: true
          }
        },
        user: true,
      },
    });
    if (current_user_id) {
      for (const post of posts) {
        const upvoted = post.upvoted_userids.find(
          (uid) => uid === current_user_id,
        );
        const downvoted = post.downvoted_userids.find(
          (uid) => uid === current_user_id,
        );
        post['upvoted'] = !!upvoted;
        post['downvoted'] = !!downvoted;
      }
    }
    return posts;
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async upVote(user_id: number, post_id: number) {
    const post = await this.prisma.post.findUnique({ where: { id: post_id } });
    if (post) {
      const userdownvoted = post.downvoted_userids.find((id) => id === user_id);

      if(!userdownvoted){
        const updated_upvoted_userids = post.upvoted_userids;

        if (!updated_upvoted_userids.includes(user_id)) {
          updated_upvoted_userids.push(user_id);
        }else{
          return {
            message: 'User already upvoted',
          };
        }
      
        return this.prisma.post.update({
          where: { id: post_id },
          data: {
            upvoted_userids: updated_upvoted_userids,
            upvote_count: {
              increment: 1,
            },
          },
        });
      }else{
        return {
          message: 'User Downvoted',
        };
      }
      
    } else {
      return {
        message: 'Post does not exist',
      };
    }
  }

  async downVote(user_id: number, post_id: number) {
    const post = await this.prisma.post.findUnique({ where: { id: post_id } });
    if (post) {
      const userupvoted = post.upvoted_userids.find((id) => id === user_id);

      if(!userupvoted){
        const updated_downvoted_userids = post.downvoted_userids;
        if (!updated_downvoted_userids.includes(user_id)) {
          updated_downvoted_userids.push(user_id);
        }else{
          return {
            message: 'User already downvoted',
          };
        }

        return this.prisma.post.update({
          where: { id: post_id },
          data: {
            downvoted_userids: updated_downvoted_userids,
            downvote_count: {
              increment: 1,
            },
          },
        });
      }else{
        return {
          message: 'User Upvoted',
        };
      }
    } else {
      return {
        message: 'Post does not exist',
      };
    }
  }

  remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}
