import { redirect, type LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return redirect("/reglementation/rating/simple");
};

export default function ReglementationIndex() {
  return null;
}
