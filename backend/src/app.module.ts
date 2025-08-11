import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { DrizzleModule } from './drizzle/drizzle.module';

@Module({
  imports: [TasksModule, DrizzleModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
