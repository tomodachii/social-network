import { CommentEntity } from '../entities';
import { PostEntity } from '../post.entity';

export interface PostRepositoryPort {
  findPostById(id: string): Promise<PostEntity>;
  createPost(post: PostEntity): Promise<boolean>;
  savePost(post: PostEntity): Promise<boolean>;
  deletePost(post: PostEntity): Promise<boolean>;
  findCommentById(id: string): Promise<CommentEntity>;
}
