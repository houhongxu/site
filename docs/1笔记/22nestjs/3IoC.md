# IoC

后端系统中，会有很多对象

Controller 依赖了 Service 实现业务逻辑，Service 依赖了 Repository 来做增删改查，Repository 依赖 DataSource 来建立连接，DataSource 又需要从 Config 对象拿到用户名密码等信息

```ts
const config = new Config({ username: "xxx", password: "xxx" });

const dataSource = new DataSource(config);

const repository = new Repository(dataSource);

const service = new Service(repository);

const controller = new Controller(service);
```

要经过一系列的初始化之后才可以使用 Controller 对象。

而且像 config、dataSource、repository、service、controller 等这些对象不需要每次都 new 一个新的，一直用一个就可以，也就是保持单例

IoC 就是解决了这个问题

它有一个放对象的容器，程序初始化的时候会扫描 class 上声明的依赖关系，然后把这些 class 都给 new 一个实例放到容器里

创建对象的时候，还会把它们依赖的对象注入进去。

这样不就完成了自动的对象创建和组装么？

这种依赖注入的方式叫做 Dependency Injection，简称 DI

而这种方案为什么叫 IoC 也很容易理解了，本来是手动 new 依赖对象，然后组装起来，现在是声明依赖了啥，等待被注入。

从主动创建依赖到被动等待依赖注入，这就是 Inverse of Control，反转控制

```ts
@Controller("api/person")
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get("find")
  query(@Query("name") name: string, @Query("age") age: number) {
    return this.personService.query(name, age);
  }

  @Get(":id")
  urlParam(@Param("id") id: string) {
    return this.personService.urlParam(+id);
  }

  @Post()
  body(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.body(createPersonDto);
  }

  @Post("file")
  @UseInterceptors(AnyFilesInterceptor({ dest: "uploads" }))
  file(@Body() createPersonDto: CreatePersonDto, @UploadedFiles() files: any) {
    return this.personService.file(createPersonDto, files);
  }
}

@Injectable()
export class PersonService {
  urlParam(id: number) {
    return `received: id=${id}`;
  }

  query(name: string, age: number) {
    return `received: name=${name}, age=${age}`;
  }

  body(createPersonDto: CreatePersonDto) {
    return `received: ${JSON.stringify(createPersonDto)}`;
  }

  file(createPersonDto: CreatePersonDto, files: any) {
    return `received: ${JSON.stringify(
      createPersonDto
    )}, files: ${JSON.stringify(files)}`;
  }
}
```

@Controller 下面的 service 声明了`constructor(private readonly personService: PersonService) {}
` 或者改成`@Inject private readonly personService: PersonService`，然后 IoC 就会将 service 注入到 controller 中

前者是构造器注入，后者是属性注入，效果一样
