# AOP

后端框架基本都是 MVC 的架构

在这个流程中，Nest 还提供了 AOP （Aspect Oriented Programming）的能力，也就是面向切面编程的能力

在调用 Controller 之前和之后加入一个执行通用逻辑的阶段

类似于 Express 的中间件

而且其中就有中间件

## Middleware

全局中间件和 express 一样

通过 app.use 使用即可

```ts
app.use(function (req: Request, res: Response, next: NextFunction) {
  console.log("before", req.url);
  next();
  console.log("after");
});
```

路由中间件则不太一样

```ts
@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log("before2", req.url);

    next();

    console.log("after2");
  }
}

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes("/api/person/*");
  }
}
```

## Guard

全局

```ts
app.useGlobalGuards(
  new (class implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      return false;
    }
  })()
);
```

路由

```ts
@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log("login check");
    return false;
  }
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(LoginGuard)
  getHello(): string {
    console.log("handle");

    return this.appService.getHello();
  }
}
```

## Interceptor

除了路由和全局，还可以用在 controller

```ts
@Injectable()
export class TimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        console.log("time: ", Date.now() - startTime);
      })
    );
  }
}

@Controller()
@UseInterceptors(TimeInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(TimeInterceptor)
  getHello(): string {
    console.log("handle");

    return this.appService.getHello();
  }
}

app.useGlobalInterceptors(new TimeInterceptor());
```

区别与 middleware，interceptor 可以拿到调用的 controller 和 handler

## Pipe

Pipe 是管道的意思，用来对参数做一些检验和转换

除了全局和 controller，还可以只对某个参数使用

```ts
@Injectable()
export class ValidatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (Number.isNaN(parseInt(value))) {
      throw new BadRequestException(`参数${metadata.data}错误`);
    }

    return typeof value === "number" ? value * 10 : parseInt(value) * 10;
  }
}

@Controller()
@UsePipes(ValidatePipe)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Query("num", ValidatePipe) num: number): string {
    console.log("handle", num);

    return this.appService.getHello(num);
  }
}

app.useGlobalPipes(new ValidatePipe());
```

## Exception Filter

```ts
@Catch(BadRequestException)
export class TestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();

    response.status(400).json({
      statusCode: 400,
      message: "test: " + exception.message,
    });
  }
}
```

## 顺序

并非完全线性，但是大概如下

Middleware=>Guard=>Inerceptor=>Pipe=>Exception Filter
