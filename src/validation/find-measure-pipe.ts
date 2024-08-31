import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMeasureDto } from 'src/meansure/dto/update-measure.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FindMeasurePipe implements PipeTransform {
  constructor(private readonly prismaService: PrismaService) {}

  async transform(value: UpdateMeasureDto) {
    const { measure_uuid } = value;

    const findExistentMeasure = await this.prismaService.measure.findUnique({
      where: {
        id: measure_uuid,
      },
    });

    if (!findExistentMeasure) {
      throw new NotFoundException({
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura do mês já realizada',
      });
    }

    return value;
  }
}
