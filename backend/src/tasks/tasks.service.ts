import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto, Priority } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { type DBConnectionType, DRIZZLE } from 'src/drizzle/drizzle.module';
import * as schema from "../drizzle/schema";
import { and, count, eq, gte, lte, sql } from 'drizzle-orm';

@Injectable()
export class TasksService {
  constructor(@Inject(DRIZZLE) private db: DBConnectionType) { }

  async create(createTaskDto: CreateTaskDto) {
    const value = {
      ...createTaskDto,
      estimatedHours: createTaskDto.estimatedHours.toString()
    };
    return await this.db.insert(schema.tasks).values(value).returning();
  }

  async findAll(skip: number, limit: number) {
    return await this.db
      .select()
      .from(schema.tasks)
      .offset(skip)
      .limit(limit);
  }

  async countByPriority(startDate?: Date, endDate?: Date, priority?: Priority) {
    const data = await this.db
      .select({ priority: schema.tasks.priority, total: count(schema.tasks.priority) })
      .from(schema.tasks)
      .where(and(...[
        startDate ? gte(schema.tasks.createdAt, startDate) : undefined,
        endDate ? lte(schema.tasks.createdAt, endDate) : undefined,
        priority ? eq(schema.tasks.priority, priority) : undefined
      ]))
      .groupBy(schema.tasks.priority);

    const low = data.find(c => c.priority == "LOW");
    const medium = data.find(c => c.priority == "MEDIUM");
    const high = data.find(c => c.priority == "HIGH");

    return {
      LOW: low?.total ?? 0,
      MEDIUM: medium?.total ?? 0,
      HIGH: high?.total ?? 0,
    };
  }

  async generateStatistics(startDate?: Date, endDate?: Date, priority?: Priority) {
    return await this.db
      .select({
        DAY: sql`DATE_TRUNC('day', ${schema.tasks.createdAt})::date`,
        LOW: sql<number>`COUNT(*) FILTER (WHERE ${schema.tasks.priority} = 'LOW')`,
        MEDIUM: sql<number>`COUNT(*) FILTER (WHERE ${schema.tasks.priority} = 'MEDIUM')`,
        HIGH: sql<number>`COUNT(*) FILTER (WHERE ${schema.tasks.priority} = 'HIGH')`,
      })
      .from(schema.tasks)
      .where(and(...[
        startDate ? gte(schema.tasks.createdAt, startDate) : undefined,
        endDate ? lte(schema.tasks.createdAt, endDate) : undefined,
        priority ? eq(schema.tasks.priority, priority) : undefined
      ]))
      .groupBy(sql`DATE_TRUNC('day', ${schema.tasks.createdAt})::date`)
      .orderBy(sql`DATE_TRUNC('day', ${schema.tasks.createdAt})::date`);
  }

  async findOne(id: string) {
    return (await this.db.select().from(schema.tasks).where(eq(schema.tasks.id, id)))[0];
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const value = {
      ...updateTaskDto,
      estimatedHours: updateTaskDto.estimatedHours?.toString()
    };
    return (await this.db.update(schema.tasks).set(value).where(eq(schema.tasks.id, id)).returning())[0];
  }

  async remove(id: string) {
    return await this.db.delete(schema.tasks).where(eq(schema.tasks.id, id)).returning();
  }
}
