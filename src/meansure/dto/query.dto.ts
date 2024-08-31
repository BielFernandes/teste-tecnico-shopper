import { IsEnum, IsOptional } from 'class-validator';

enum MeasureType {
  WATER = 'WATER',
  GAS = 'GAS',
}

export class QueryDto {
  @IsOptional()
  @IsEnum(MeasureType, { message: 'Tipo de medição não permitida' })
  measure_type?: MeasureType;
}
