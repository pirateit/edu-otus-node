import { ForbiddenException, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/auth.decorator";
import { PostService } from "../post/post.service";
import { User } from "./user.model";
import { UserService } from "./user.service";

@Resolver('User')
export class UserResolver {
  constructor(
    private userService: UserService,
    private postService: PostService,
  ) { }

  @Query('getUser')
  async getUser(@Args('userId') userId: number) {
    return this.userService.findOneById(userId);
  }

  @ResolveField()
  async posts(@Parent() user) {
    const { id } = user;

    return this.postService.findAllByUser(id);
  }

  @Mutation('updateUser')
  @UseGuards(GqlAuthGuard)
  async updateUser(@CurrentUser() user: User, @Args('userId') userId: number, @Args('userData') userData) {
    if (!user) throw new UnauthorizedException();
    if (user.id !== userId) throw new ForbiddenException();

    return this.userService.update(userId, userData);
  }

  @Mutation('blockUser')
  @UseGuards(GqlAuthGuard)
  async blockUser(@CurrentUser() user: User, @Args('userId') userId: number) {
    if (!user) throw new UnauthorizedException();
    if (user.id !== userId) throw new ForbiddenException();

    return this.userService.block(userId);
  }
}
