import { redirect } from "@remix-run/node";

// Route de redirection temporaire pour capturer les anciennes références
export async function loader() {
  return redirect("/login");
}

export async function action() {
  return redirect("/login");
}

// Composant qui ne sera jamais rendu grâce à la redirection
export default function AuthLoginRedirect() {
  return null;
}
