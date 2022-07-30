import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const reqeust = context.switchToHttp().getRequest();
    if (!data) return reqeust.user;
    return reqeust.user['data'];
  },
);
