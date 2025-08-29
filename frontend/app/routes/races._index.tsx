import { redirect } from "@remix-run/node";

export const loader = async () => {
  // Redirection vers la version dashboard
  return redirect("/dashboard/races");
};
