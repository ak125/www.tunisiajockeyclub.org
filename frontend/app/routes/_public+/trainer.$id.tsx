import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TrainerProfile } from "~/components/profiles/TrainerProfile";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  
  // Fetch trainer data from Supabase
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/users?id=eq.${id}&user_type=eq.trainer&select=*,trained_horses:horses!horses_trainer_id_fkey(*)`, {
    headers: {
      'apikey': process.env.SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY!}`
    }
  });

  if (!response.ok) {
    throw new Response("Trainer not found", { status: 404 });
  }

  const trainers = await response.json();
  const trainer = trainers[0];

  if (!trainer) {
    throw new Response("Trainer not found", { status: 404 });
  }

  return json({ trainer });
}

export default function TrainerDetailPage() {
  const { trainer } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <TrainerProfile trainer={trainer} />
      </div>
    </div>
  );
}
