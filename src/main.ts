import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '5000mb' }));
  app.use(bodyParser.urlencoded({ limit: '5000mb', extended: true }));
  await app.listen(3000);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        console.log('aaaaa');
        const errorMessages = errors
          .map((error) => {
            const constraints = Object.values(error.constraints);
            return `${error.property}: ${constraints.join(', ')}`;
          })
          .join('; ');

        return new BadRequestException({
          error_code: 'INVALID_DATA',
          error_description: errorMessages,
        });
      },
    }),
  );
}
bootstrap();
