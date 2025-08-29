import { redirect } from "@remix-run/node";

export async function loader() {
  return redirect("/reglementation/rating/simple");
}
