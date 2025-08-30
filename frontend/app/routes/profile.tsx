import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Edit3,
  Save,
  Camera,
  Settings
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";

// Types pour TypeScript
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  memberSince: string;
  totalRaces: number;
  winRate: number;
  favoriteHorse: string;
  city: string;
  country: string;
  role: string;
  createdAt: string;
  avatarUrl: string | null;
  membershipNumber: string;
}

interface UserStats {
  totalRaces: number;
  winningRaces: number;
  totalWinnings: number;
  favoriteHorse: string;
}

interface LoaderData {
  user: UserProfile;
  stats: UserStats;
}

interface ActionData {
  success: boolean;
  message: string;
}

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  // Version simplifiée pour le développement - évite les problèmes d'auth
  const mockUser = {
    id: '1',
    email: 'monia.benali@tunisia-jockey-club.tn',
    firstName: 'Monia',
    lastName: 'Ben Ali',
    phone: '+216 50 123 456',
    address: 'Tunis, Tunisie',
    dateOfBirth: '1990-05-15',
    memberSince: '2020-01-15',
    totalRaces: 145,
    winRate: 68.5,
    favoriteHorse: 'Thunder Bolt',
    city: 'Tunis',
    country: 'Tunisia',
    role: 'member',
    createdAt: '2025-08-20',
    avatarUrl: null,
    membershipNumber: 'TJC-2020-001'
  };

  const mockStats = {
    totalRaces: 145,
    winningRaces: 99,
    totalWinnings: 15420.50,
    favoriteHorse: 'Thunder Bolt'
  };

  return json({
    user: mockUser,
    stats: mockStats
  });
};

export const action = async ({ context, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  
  // Traiter la mise à jour du profil
  const updates = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"), 
    phone: formData.get("phone"),
    city: formData.get("city")
  };

  // Mock - dans un vrai projet, sauvegarder en DB
  console.log("Mise à jour profil:", updates);
  
  return json({ success: true, message: "Profil mis à jour avec succès !" });
};

export default function UserProfile() {
  const { user, stats } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          👤 Mon Profil
        </h1>
        <p className="text-slate-600">Gérez vos informations personnelles</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-1"
        >
          <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="relative mx-auto mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-slate-800">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-slate-600 mb-3">{user.email}</p>
                
                <Badge variant="default" className="mb-4">
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role === "member" ? "Membre" : user.role}
                </Badge>
                
                <div className="text-sm text-slate-600">
                  <p>N° Membre: {(user as any).membershipNumber}</p>
                  <p>Membre depuis: {new Date(user.createdAt || Date.now()).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.totalRaces}</p>
                  <p className="text-sm text-slate-600">Courses Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.winningRaces}</p>
                  <p className="text-sm text-slate-600">Courses Gagnées</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{stats.totalWinnings} DT</p>
                  <p className="text-sm text-slate-600">Gains Total</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">⭐</p>
                  <p className="text-sm text-slate-600">Cheval Favori</p>
                  <p className="text-xs text-slate-500">{stats.favoriteHorse}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-blue-600" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              {actionData?.success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg"
                >
                  ✅ {actionData.message}
                </motion.div>
              )}

              <Form method="post" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      defaultValue={user.firstName}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      defaultValue={user.lastName}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        disabled
                        className="pl-10 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={(user as any).phone}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="city"
                        name="city"
                        defaultValue={(user as any).city}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      name="country"
                      defaultValue={(user as any).country}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button type="button" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres Avancés
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8"
      >
        <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Participation à Thunder Bolt", time: "Il y a 2 heures", type: "race" },
                { action: "Connexion depuis Tunis", time: "Il y a 3 heures", type: "login" },
                { action: "Course gagnée - Prix de Carthage", time: "Hier", type: "win" },
                { action: "Profil mis à jour", time: "Il y a 2 jours", type: "profile" }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'win' ? 'bg-green-500' :
                    activity.type === 'race' ? 'bg-blue-500' :
                    activity.type === 'login' ? 'bg-purple-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-slate-800 font-medium">{activity.action}</p>
                    <p className="text-slate-500 text-sm">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
