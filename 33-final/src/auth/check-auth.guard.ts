import { AuthGuard } from "@nestjs/passport";

export class CheckAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    if (user) {
      return user;
    } else {
      return false;
    }
  }
}
