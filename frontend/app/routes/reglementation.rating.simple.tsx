import { json } from "@remix-run/node";

export const loader = async () => {
  return json({ message: "Règlementation Rating Simple" });
};

export default function ReglementationRatingSimple() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Règlementation Rating Simple</h1>
      <p>Page en cours de développement...</p>
    </div>
  );
}