# 6

REST

Controller = 协议适配

Provider = 业务逻辑

tRPC

tRPC Adapter = 协议适配（Fastify 插件）

tRPC Router = 协议描述

Provider = 业务逻辑（仍然是 NestJS 的）

Controller → Guard → Interceptor → Pipe → Service
↓ ↓ ↓ ↓ ↓
@Controller @UseGuards @UseInterceptors @Body() @Injectable()

Router → Middleware → Procedure → Service
↓ ↓ ↓ ↓
router() middleware procedure @Injectable()
