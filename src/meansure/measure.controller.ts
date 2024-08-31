import {
  Controller,
  Post,
  Body,
  Patch,
  UsePipes,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { MeasureService } from './measure.service';
import { CreateMeasureDto } from './dto/create-measure.dto';
import { CustomValidationPipe } from 'src/validation/custom-validation-pipe';
import { UniqueMeasureValidationPipe } from 'src/validation/unique-measure-validation-pipe';
import { UpdateMeasureDto } from './dto/update-measure.dto';
import { FindMeasurePipe } from 'src/validation/find-measure-pipe';
import { UpdatedValidationPipe } from 'src/validation/updated-validation-pipe';
import { QueryDto } from './dto/query.dto';

@Controller()
export class MeasureController {
  constructor(private readonly meansureService: MeasureService) {}

  @Post('upload')
  @UsePipes(CustomValidationPipe, UniqueMeasureValidationPipe)
  async create(@Body() data: CreateMeasureDto) {
    return this.meansureService.create(data);
  }

  @Patch('confirm')
  @UsePipes(CustomValidationPipe, FindMeasurePipe, UpdatedValidationPipe)
  async confirm(@Body() data: UpdateMeasureDto) {
    return this.meansureService.confirm(data);
  }

  @Get(':customer_code/list')
  @UsePipes(CustomValidationPipe)
  async list(
    @Param('customer_code') customer_code: string,
    @Query() query: QueryDto,
  ) {
    return this.meansureService.listAllMeasures(
      customer_code,
      query.measure_type,
    );
  }
}
