import { Module } from '@nestjs/common';
import { HttpService } from 'src/services/http.service';
import { MeasureController } from './measure.controller';
import { MeasureService } from './measure.service';

@Module({
  controllers: [MeasureController],
  providers: [MeasureService, HttpService],
})
export class MeasureModule {}
