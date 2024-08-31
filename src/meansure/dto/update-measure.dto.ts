import { IsNumber, IsString } from 'class-validator';

export class UpdateMeasureDto {
  @IsString()
  measure_uuid: string;

  @IsNumber()
  confirmed_value: number;
}
