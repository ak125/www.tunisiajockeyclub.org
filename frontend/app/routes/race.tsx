import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  // Rediriger vers la page des courses
  return redirect("/races");
}

export default function RaceRedirect() {
  return null;
}
