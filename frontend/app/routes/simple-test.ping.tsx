import { json } from "@remix-run/node";

export const loader = async () => {
  const timestamp = new Date().toISOString();
  const uptime = process.uptime();
  
  return json({
    status: "pong",
    message: "Tunisia Jockey Club - IFHA System",
    timestamp,
    uptime: Math.round(uptime),
    version: "1.0.0",
    success: true
  });
};

export default function PingPage() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🏓</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Ping Test
        </h1>
        
        <p className="text-gray-600 mb-6">
          Système opérationnel
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">✅ Pong!</p>
          <p className="text-green-600 text-sm mt-1">
            Le serveur répond correctement
          </p>
        </div>
      </div>
    </div>
  );
}
