import { PipeTransform, Injectable, ConflictException } from '@nestjs/common';
import { CreateMeasureDto } from 'src/meansure/dto/create-measure.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UniqueMeasureValidationPipe implements PipeTransform {
  constructor(private readonly prismaService: PrismaService) {}

  async transform(value: CreateMeasureDto) {
    const { customer_code, measure_datetime, measure_type } = value;

    const date = new Date(measure_datetime);

    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const customerWithMeasuresInMonth =
      await this.prismaService.customer.findFirst({
        where: {
          code: customer_code,
          measures: {
            some: {
              measureDate: {
                gte: firstDayOfMonth,
                lte: lastDayOfMonth,
              },
              type: measure_type,
            },
          },
        },
        include: {
          measures: true,
        },
      });

    console.log(customerWithMeasuresInMonth);

    if (customerWithMeasuresInMonth) {
      throw new ConflictException({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }

    return value; // Retorna o valor se não houver duplicatas
  }
}
