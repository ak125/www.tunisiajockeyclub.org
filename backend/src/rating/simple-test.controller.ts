import { Controller, Get, Param } from '@nestjs/common';

@Controller('simple-test')
export class SimpleTestController {

  @Get('status')
  getStatus() {
    return {
      message: 'Test simple opérationnel',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  @Get('ping')
  ping() {
    return { 
      pong: true, 
      timestamp: new Date().toISOString() 
    };
  }

  @Get('rating/:horseId')
  async getTestRating(@Param('horseId') horseId: string) {
    return {
      horseId,
      message: `Test rating pour cheval ${horseId}`,
      rating: Math.floor(Math.random() * 20) + 30,
      category: 'Test',
      timestamp: new Date().toISOString()
    };
  }
}
