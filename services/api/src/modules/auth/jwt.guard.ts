import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 1) @Public()가 붙은 곳은 통과
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // 2) Swagger 문서(/docs, /docs-json)는 항상 허용 (선택)
    const req = context.switchToHttp().getRequest();
    const path: string = req?.path || req?.url || '';
    if (path.startsWith('/docs')) return true;

    // 3) 그 외는 기본적으로 JWT 필요
    return super.canActivate(context);
  }
}
