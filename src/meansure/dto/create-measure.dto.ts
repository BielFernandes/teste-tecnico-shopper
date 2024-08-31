import { MeasureType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateMeasureDto {
  @IsString({ message: 'Informe a image.' })
  image: string;

  @IsString({ message: 'Informe o código do cliente.' })
  customer_code: string;

  @IsString({ message: 'Informe a data da medição.' })
  measure_datetime: string;

  @IsEnum(MeasureType, {
    message: 'Informe o tipo de medição.',
  })
  measure_type: MeasureType;
}
