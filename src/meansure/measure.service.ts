import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from 'src/services/http.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMeasureDto } from './dto/create-measure.dto';
import { UpdateMeasureDto } from './dto/update-measure.dto';
import { MeasureType } from '@prisma/client';

@Injectable()
export class MeasureService {
  constructor(
    protected httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(data: CreateMeasureDto) {
    const { image, customer_code, measure_datetime, measure_type } = data;

    const { imgDataByte, imgDataExt } = this.processBase64String(image);
    const temporaryLink = await this.generateTemporalyLink(imgDataByte);
    const measure = await this.searchMeasure(
      imgDataByte,
      measure_type,
      imgDataExt,
    );
    const measureAndCustomerTransaction = await this.prismaService.$transaction(
      async (prisma) => {
        let customer = await prisma.customer.findUnique({
          where: {
            code: customer_code,
          },
        });

        if (!customer) {
          customer = await prisma.customer.create({
            data: {
              code: data.customer_code,
            },
          });
        }

        return await prisma.measure.create({
          data: {
            measure,
            type: measure_type,
            measureDate: measure_datetime,
            customerId: customer.id,
          },
        });
      },
    );

    return {
      image_url: temporaryLink,
      measure_value: measureAndCustomerTransaction.measure,
      measure_uuid: measureAndCustomerTransaction.id,
    };
  }

  async confirm(data: UpdateMeasureDto) {
    return this.prismaService.measure.update({
      where: { id: data.measure_uuid },
      data: {
        measure: data.confirmed_value,
        updatedAt: new Date(),
      },
    });
  }

  async listAllMeasures(customer_code: string, query) {
    const conditional = {
      where: {
        type: {
          equals: query.toLowerCase() as MeasureType,
        },
      },
    };
    const customerMeasures = await this.prismaService.customer.findMany({
      where: {
        code: customer_code,
      },
      include: {
        measures: query ? conditional : true,
      },
    });

    if (
      !customerMeasures ||
      customerMeasures.length === 0 ||
      !customerMeasures[0].measures ||
      customerMeasures[0].measures.length < 1
    ) {
      throw new BadRequestException({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
    }

    return customerMeasures;
  }

  private async searchMeasure(
    dataByte: string,
    measureType: string,
    imgDataExt: string,
  ) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const result = await model.generateContent([
      {
        inlineData: {
          data: Buffer.from(dataByte).toString(),
          mimeType: `image/${imgDataExt}`,
        },
      },
      {
        text: `Receive a base64-encoded image of a ${measureType == 'gas' && 'gas flow'} meter. Your task is to analyze the image and extract the numerical reading shown on the meter. Only provide the numerical value of the reading from the image, without any additional text or explanation.`,
      },
    ]);

    return parseInt(result.response.text().trim());
  }

  private processBase64String(imageBase64: string): {
    imgDataByte: string;
    imgDataExt: string;
  } {
    if (!imageBase64) {
      throw new Error('Imagem não fornecida');
    }

    const matches = imageBase64.match(
      /^data:image\/(png|jpeg|webp|heic|heif);base64,(.+)$/,
    );

    if (!matches) {
      throw new BadRequestException('Este cupom já atingiu o limite de uso.');
    }

    return {
      imgDataByte: matches[2],
      imgDataExt: matches[1],
    };
  }

  private async generateTemporalyLink(base64Img: string): Promise<string> {
    try {
      const link = await this.httpService.post(
        'https://api.imgur.com/3/upload',
        {
          image: base64Img,
          type: 'base64',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Client-ID 40aa173edfa633f',
          },
        },
      );

      return link.data.data.link;
    } catch (error) {
      console.log(error);
    }
  }
}
