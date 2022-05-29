import { ForbiddenException, NotFoundException, UseGuards } from "@nestjs/common";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "../auth/auth.decorator";
import { PostService } from "./post.service";
import { UserService } from "../user/user.service";
import { Post } from "./post.model";
import { GqlAuthGuard } from "../auth/jwt-auth.guard";
import { User } from "../user/user.model";

@Resolver('Post')
export class PostResolver {
  constructor(
    private postService: PostService,
    private userService: UserService,
  ) { }

  @Query('getPost')
  getPost(@Args('postId') postId: number): Promise<Post> {
    return this.postService.findOneById(postId);
  }

  @Query('getAllPosts')
  getAllPosts(): Promise<Post[]> {
    return this.postService.findAll();
  }

  @Query('getUserPosts')
  getUserPosts(@Args('userId') userId: number): Promise<Post[]> {
    return this.postService.findAllByUser(userId);
  }

  @ResolveField()
  author(@Parent() post: Post) {
    const { author_id } = post;

    return this.userService.findOneById(author_id);
  }

  @Mutation('createPost')
  @UseGuards(GqlAuthGuard)
  createPost(@CurrentUser() user: User, @Args('title') title: string, @Args('content') content: string) {
    const post = {
      title,
      content,
      author_id: user.id
    };

    return this.postService.create(post);
  }

  @Mutation('updatePost')
  @UseGuards(GqlAuthGuard)
  async updatePost(@CurrentUser() user: User, @Args() newPostData) {
    const postData = await this.postService.findOneById(newPostData.postId);

    if (!postData) return new NotFoundException();
    if (user.id !== postData.author_id) throw new ForbiddenException();

    const post = {
      title: newPostData.title,
      content: newPostData.content
    };

    return this.postService.update(newPostData.postId, post);
  }

  @Mutation('deletePost')
  @UseGuards(GqlAuthGuard)
  async deletePost(@CurrentUser() user: User, @Args('postId') postId: number) {
    const postData = await this.postService.findOneById(postId);

    if (!postData) return new NotFoundException();
    if (user.id !== postData.author_id) throw new ForbiddenException();

    return this.postService.delete(postId);
  }
}
