import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from '@remix-run/react';
import { Button } from '~/components/ui/button';


export const loader = async ({ request }: LoaderFunctionArgs) => {
    // Pour l'instant, pas de vérification d'utilisateur connecté
    return null;
};


export const action = async ({ request }: ActionFunctionArgs) => {
    console.log('🔍 Action login - Debut');
    
    try {
        const formData = await request.formData();
        const email = formData.get('email')?.toString();
        const password = formData.get('password')?.toString();
        
        console.log('🔐 Tentative de connexion pour:', email);
        
        if (!email || !password) {
            return json(
                { error: 'Email et mot de passe requis' },
                { status: 400 }
            );
        }
        
        // Authentification via le backend NestJS
        try {
            const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
            
            // Authentifier avec le backend
            const authResponse = await fetch(`${backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            if (!authResponse.ok) {
                return json(
                    { error: 'Erreur de connexion au serveur' },
                    { status: 500 }
                );
            }
            
            const authResult = await authResponse.json();
            
            if (!authResult.success) {
                console.log('❌ Authentification échouée:', authResult.message);
                return json(
                    { 
                        error: authResult.message,
                        availableUsers: authResult.availableUsers 
                    },
                    { status: 401 }
                );
            }
            
            // Si auth OK, rediriger avec le token ou créer une session Remix
            console.log('✅ Authentification réussie pour:', email);
            
            // Pour l'instant, rediriger vers le dashboard
            // TODO: Implémenter la persistance de session Remix
            return redirect('/dashboard');
            
        } catch (fetchError) {
            console.error('❌ Erreur de connexion au backend:', fetchError);
            return json(
                { error: 'Erreur de connexion au serveur' },
                { status: 500 }
            );
        }
        
    } catch (error) {
        console.error('❌ Erreur dans l\'action login:', error);
        return json(
            { error: 'Erreur lors du traitement du formulaire' },
            { status: 500 }
        );
    }
};

export default function Login() {
    const actionData = useActionData<typeof action>();
    
    return (
        <div className='max-w-[600px] mx-auto'>
            <h1>Connexion</h1>
            <Form method='POST' className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="email">Adresse e-mail</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className='border rounded px-3 py-2'
                    />
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className='border rounded px-3 py-2'
                    />
                </div>

                {actionData && 'error' in actionData && (
                    <div className="text-red-500">{actionData.error}</div>
                )}

                <Button className='ml-auto' type='submit'>
                    Se connecter
                </Button>
            </Form>
        </div>
    );
}