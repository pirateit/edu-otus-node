import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Role } from '../auth/role.enum';
import { UserService } from './user.service';
import { User } from "./user.model";

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    let request = context.switchToHttp().getRequest();

    if (request.user) {
      request.user = await this.userService.findOneById(request.user.id);
      request.user.role = {
        id: request.user.role,
        title: Object.values(Role)[1],
      };
    }

    return next
      .handle();
  }
}
