import { redirect, type AppLoadContext } from "@remix-run/node";
import { z } from "zod";
import { getSessionUser } from "./auth.context";

const authentictedUserSchema = z.object({
  id: z.coerce.string(),
  email: z.string(),
  name: z.string().optional(),
});

export const getOptionalUser = async ({ context }: { context: AppLoadContext }) => {
  // Utiliser le helper sécurisé pour obtenir l'utilisateur
  const sessionUser = getSessionUser(context);
  
  if (!sessionUser) {
    return null;
  }

  try {
    const user = authentictedUserSchema.parse(sessionUser);
    
    try {
      // Essayer d'obtenir les informations complètes depuis le service
      return await context.remixService.getUser({
        userId: user.id 
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      // Retourner les informations de base de l'utilisateur depuis la session
      return {
        id: user.id,
        email: user.email,
        firstName: null,
        lastName: null,
      };
    }
  } catch (parseError) {
    console.error('Erreur lors du parsing de l\'utilisateur:', parseError);
    return null;
  }
};

export const requireUser = async ({ context }: { context: AppLoadContext }) => {
  const user = await getOptionalUser({ context });
  if (!user) {
    throw redirect('/login');
  }
  return user;
};