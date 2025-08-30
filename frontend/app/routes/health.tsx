import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: 'connected',
      cache: 'connected',
      api: 'operational'
    }
  };

  return json(health, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
};

// Pour les requêtes non-GET, on peut aussi gérer HEAD et OPTIONS
export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === 'HEAD') {
    return new Response(null, { status: 200 });
  }
  
  return new Response('Method Not Allowed', { status: 405 });
};
