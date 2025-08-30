import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { JockeyProfile } from "~/components/profiles/JockeyProfile";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  
  // Fetch jockey data from Supabase
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/users?id=eq.${id}&user_type=eq.jockey&select=*,jockey_inscriptions:inscriptions!inscriptions_jockey_id_fkey(race:races(*),horse:horses(*))`, {
    headers: {
      'apikey': process.env.SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY!}`
    }
  });

  if (!response.ok) {
    throw new Response("Jockey not found", { status: 404 });
  }

  const jockeys = await response.json();
  const jockey = jockeys[0];

  if (!jockey) {
    throw new Response("Jockey not found", { status: 404 });
  }

  return json({ jockey });
}

export default function JockeyDetailPage() {
  const { jockey } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <JockeyProfile jockey={jockey} />
      </div>
    </div>
  );
}
