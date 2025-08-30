import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        throw new BadRequestException({
          message: 'Données de validation invalides',
          errors: errorMessages,
          statusCode: 400,
        });
      }
      throw new BadRequestException('Erreur de validation');
    }
  }
}

// Factory pour créer des pipes de validation
export function createZodPipe(schema: ZodSchema) {
  return new ZodValidationPipe(schema);
}
