import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { HorseProfile } from "~/components/profiles/HorseProfile";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  
  // Fetch horse data from Supabase
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/horses?id=eq.${id}&select=*,owner:users!horses_owner_id_fkey(*),trainer:users!horses_trainer_id_fkey(*),inscriptions(race:races(*))`, {
    headers: {
      'apikey': process.env.SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY!}`
    }
  });

  if (!response.ok) {
    throw new Response("Horse not found", { status: 404 });
  }

  const horses = await response.json();
  const horse = horses[0];

  if (!horse) {
    throw new Response("Horse not found", { status: 404 });
  }

  return json({ horse });
}

export default function HorseDetailPage() {
  const { horse } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <HorseProfile horse={horse} />
      </div>
    </div>
  );
}
