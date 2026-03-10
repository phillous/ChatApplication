import { applyDecorators, CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";


type ClassConstructor<T = any> = {
  new (...args: any[]): T;
};

export function UseCookie(dto: ClassConstructor, tokenName: string, duration: number) {
    return applyDecorators(
        UseInterceptors(new CookieInterceptor(dto, tokenName, duration))
    )
}

export class CookieInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor, private tokenName: string, private duration: number) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        const tokenValue = data?.token ?? data?.resetToken;

        if (tokenValue) {
          res.cookie(this.tokenName, tokenValue, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: 'strict',
            path: '/',
            signed: true,
          });
        }

        return plainToClass(this.dto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}
