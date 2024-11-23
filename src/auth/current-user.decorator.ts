import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { CurrentUSerDto } from './dto/current-user.dto';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: CurrentUSerDto }>();

    return request.user;
  }
);
