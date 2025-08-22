import {
    json,
    redirect,
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
} from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { Button } from '~/components/ui/button';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // Pour l'instant, pas de vérification d'utilisateur connecté
    return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const firstname = formData.get('firstname')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !firstname || !password) {
        return json(
            { error: 'Tous les champs sont requis' },
            { status: 400 }
        );
    }

    // TODO: Implémenter la vraie création de compte
    console.log('Registration attempt:', { email, firstname });
    return redirect('/');
};

export default function Register() {
    const actionData = useActionData<typeof action>();
    const isLoading = useNavigation().state === 'submitting';
    
    return (
        <div className='max-w-[600px] mx-auto'>
            <h1>Création de compte</h1>
            <Form method='POST' className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="firstname">Votre prénom</label>
                    <input
                        id="firstname"
                        name="firstname"
                        type="text"
                        required
                        className='border rounded px-3 py-2'
                    />
                </div>

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

                <Button disabled={isLoading} className='ml-auto' type='submit'>
                    Je créer mon compte
                </Button>
            </Form>
        </div>
    );
}