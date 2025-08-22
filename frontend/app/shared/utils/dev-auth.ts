import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { createMockAuthContext } from '../../server/auth.context';
import { getOptionalUser } from '../../server/auth.server';

// Helper pour créer un loader de développement avec utilisateur simulé
export function createDevelopmentLoader(
  handler: (args: LoaderFunctionArgs & { user: any }) => Promise<any>,
  options: { requireAuth?: boolean; mockUserId?: string } = {}
) {
  return async (args: LoaderFunctionArgs) => {
    const { requireAuth = false, mockUserId = '1' } = options;
    
    // En développement, créer un contexte avec utilisateur simulé si nécessaire
    if (process.env.NODE_ENV === 'development') {
      const mockContext = createMockAuthContext(args.context, mockUserId);
      const mockArgs = { ...args, context: mockContext };
      
      try {
        const user = await getOptionalUser({ context: mockContext });
        if (requireAuth && !user) {
          // Créer un utilisateur simulé
          const mockUser = {
            id: mockUserId,
            email: `user${mockUserId}@tunisiajockeyclub.com`,
            firstName: `Utilisateur`,
            lastName: `${mockUserId}`,
          };
          
          return await handler({ ...mockArgs, user: mockUser });
        }
        
        return await handler({ ...mockArgs, user });
      } catch (error) {
        console.error('Erreur dans le loader de développement:', error);
        
        if (requireAuth) {
          // En développement, créer un utilisateur de fallback
          const fallbackUser = {
            id: mockUserId,
            email: `fallback@tunisiajockeyclub.com`,
            firstName: `Utilisateur`,
            lastName: `Fallback`,
          };
          
          return await handler({ ...args, user: fallbackUser });
        }
        
        return await handler({ ...args, user: null });
      }
    }
    
    // En production, utiliser la logique normale
    try {
      const user = await getOptionalUser({ context: args.context });
      return await handler({ ...args, user });
    } catch (error) {
      console.error('Erreur dans le loader de production:', error);
      
      if (requireAuth) {
        throw new Response('Authentication required', { status: 401 });
      }
      
      return await handler({ ...args, user: null });
    }
  };
}
