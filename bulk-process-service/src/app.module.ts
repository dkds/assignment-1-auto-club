import { HttpModule, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphqlService } from './graphql/graphql.service';

@Module({
  controllers: [],
  providers: [AppService, GraphqlService],
  imports: [HttpModule]
})
export class AppModule {
}
