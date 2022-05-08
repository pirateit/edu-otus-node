import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { User } from "../graphql";
import { CurrentUser } from "./auth.decorator";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private authService: AuthService,
  ) { }

  @Mutation('login')
  @UseGuards(LocalAuthGuard)
  login(@CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @Mutation('register')
  register(@Args('email') email: string, @Args('password') password: string) {
    return this.authService.register(email, password);
  }
}
