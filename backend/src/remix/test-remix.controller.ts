import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from '../auth/global-auth.guard';

@Controller()
export class TestRemixController {
  @Public()
  @All('*')
  async handler(@Req() request: Request, @Res() response: Response) {
    // Ignorer les routes API
    if (request.path.startsWith('/api/')) {
      return response.status(404).json({ 
        statusCode: 404, 
        timestamp: new Date().toISOString(), 
        path: request.path 
      });
    }

    // Servir une page simple pour toutes les autres routes
    return response.send(`
      <html>
        <head><title>Tunisia Jockey Club - Test</title></head>
        <body>
          <h1>Tunisia Jockey Club</h1>
          <p>Frontend de test - Route: ${request.path}</p>
          <p><a href="/api/courses-test/stats">API Courses Test</a></p>
        </body>
      </html>
    `);
  }
}
