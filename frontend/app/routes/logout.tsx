import { type ActionFunction } from "@remix-run/node";
import { logout } from "../utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  return await logout(request);
};

// Rediriger toute requête GET vers login
export const loader = () => {
  throw new Response("", { status: 302, headers: { Location: "/login" } });
};
