import {
  Injectable,
  ValidationPipe,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (error) {
      if (error instanceof BadRequestException) {
        const response = error.getResponse() as any;

        console.log('resp:::', response);

        if (response.message && Array.isArray(response.message)) {
          throw new BadRequestException({
            error_code:
              response.message[0] == 'Tipo de medição não permitida'
                ? 'INVALID_TYPE'
                : 'INVALID_DATA',
            error_description: response.message,
          });
        }
      }

      throw error;
    }
  }
}
