import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEventsController } from './calendar-events.controller';
import { CalendarEventsService } from './calendar-events.service';
import { CalendarEventRepository } from '../../database/repositories/calendar-event.repository';
import { CalendarEventEntity } from '../../database/entities/calendar-event.entity';
import { BuildingEntity } from '../../database/entities/building.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEventEntity, BuildingEntity])],
  controllers: [CalendarEventsController],
  providers: [CalendarEventsService, CalendarEventRepository],
  exports: [CalendarEventsService, CalendarEventRepository],
})
export class CalendarEventsModule {}
