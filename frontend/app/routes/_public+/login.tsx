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
        
        console.log('Login attempt for:', email);
        
        // Pour l'instant, on simule une authentification simple
        if (email && password) {
            // TODO: Implémenter la vraie authentification
            return redirect('/');
        }
        
        return json(
            { error: 'Email et mot de passe requis' },
            { status: 400 }
        );
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