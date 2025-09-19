import { Controller, Get } from '@nestjs/common';

@Controller('api/test-jekitis')
export class JektisTestController {
  
  @Get()
  testJektis() {
    return {
      status: 'success',
      message: 'Prix DE JEKITIS - Test endpoint',
      race: {
        id: 'bg-2025-001',
        name: 'Prix DE JEKITIS',
        date: '2025-08-02T16:30:00',
        venue: 'Hippodrome de Ben Guerdane',
        distance: '1400m',
        prize: '4.250 DT',
        participants: 11,
        conditions: 'Pour poulains et pouliches de 3 ans Pur Sang Arabe'
      },
      timestamp: new Date().toISOString()
    };
  }

  @Get('check')
  checkStatus() {
    return {
      service: 'JektisTestController',
      status: 'ACTIVE',
      message: 'Le Prix DE JEKITIS est prêt !',
      timestamp: new Date().toISOString()
    };
  }
}
