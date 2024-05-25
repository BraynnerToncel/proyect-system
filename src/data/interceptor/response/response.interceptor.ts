import { IResponse } from '@interface/response/response.interface';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  private readonly logger: Logger = new Logger(ResponseInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    return next.handle().pipe(
      tap((data) => {
        if ((process.env.DEBUG_CONTROLLER_RESPONSE as string) === '1')
          this.logger.log(data);
      }),
      map(
        (data) =>
          ({
            status: (data && data.status) ?? 200,
            message:
              (data && data.message) ?? (data && data.status === 401)
                ? 'UNAUTORIZED'
                : !data
                  ? 'NOT_DATA'
                  : 'SUCCESS',
            result: data ?? {},
          }) as IResponse<T>,
      ),
    );
  }
}
