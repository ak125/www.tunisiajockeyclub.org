import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { getSession, commitSession } from '~/utils/session.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Connexion - Tunisia Jockey Club' },
    { name: 'description', content: 'Connectez-vous à votre compte Tunisia Jockey Club' },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  // Validation basique
  if (typeof email !== 'string' || typeof password !== 'string') {
    return json(
      { errors: { email: 'Email requis', password: 'Mot de passe requis' } },
      { status: 400 }
    );
  }

  if (email.length === 0) {
    return json(
      { errors: { email: 'Email requis', password: null } },
      { status: 400 }
    );
  }

  if (password.length === 0) {
    return json(
      { errors: { email: null, password: 'Mot de passe requis' } },
      { status: 400 }
    );
  }

  try {
    // Utiliser le backend NestJS pour l'authentification
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    console.log('Réponse authentification backend:', result);

    if (result.success) {
      // Authentification réussie - créer la session Remix
      const session = await getSession(request.headers.get('Cookie'));
      session.set('user', result.user);
      
      const cookie = await commitSession(session);
      
      return redirect('/dashboard', {
        headers: {
          'Set-Cookie': cookie,
        },
      });
    } else {
      return json(
        { 
          errors: { 
            email: null, 
            password: result.message || 'Email ou mot de passe invalide' 
          } 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    return json(
      { 
        errors: { 
          email: null, 
          password: 'Erreur de connexion au serveur' 
        } 
      },
      { status: 500 }
    );
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-green-800">
            Tunisia Jockey Club
          </CardTitle>
          <CardDescription className="text-center text-green-600">
            Connectez-vous à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="votre@email.com"
                className="w-full"
              />
              {actionData?.errors?.email && (
                <div className="text-red-500 text-sm">{actionData.errors.email}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Votre mot de passe"
                className="w-full"
              />
              {actionData?.errors?.password && (
                <div className="text-red-500 text-sm">{actionData.errors.password}</div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}