import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext): string => {
    const reqeust = context.switchToHttp().getRequest();
    return reqeust.user['sub'];
  },
);
