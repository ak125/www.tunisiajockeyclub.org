import { json } from "@remix-run/node";

export const loader = async () => {
  return json({ message: "Page en développement" });
};

export default function Reglementationratingsimple() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reglementationratingsimple</h1>
      <p className="text-gray-600">Cette page est en cours de développement...</p>
      <div className="mt-4">
        <a href="/dashboard" className="text-blue-600 hover:text-blue-800">
          ← Retour au Dashboard
        </a>
      </div>
    </div>
  );
}
