import React from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Calendar, Star, Award } from 'lucide-react';

interface Race {
  id: string;
  name: string;
  date: string;
  prize: number;
}

interface JockeyInscription {
  race: Race;
  horse: {
    id: string;
    name: string;
  };
}

interface JockeyData {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  jockey_inscriptions?: JockeyInscription[];
}

interface JockeyProfileProps {
  jockey: JockeyData;
}

export function JockeyProfile({ jockey }: JockeyProfileProps) {
  const raceCount = jockey.jockey_inscriptions?.length || 0;
  const totalPrizes = jockey.jockey_inscriptions?.reduce((sum, inscription) => sum + (inscription.race?.prize || 0), 0) || 0;
  const uniqueHorses = new Set(jockey.jockey_inscriptions?.map(inscription => inscription.horse?.id)).size;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 mb-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{jockey.full_name}</h1>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Jockey Professionnel
              </span>
              <span className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                {raceCount} Courses
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{raceCount}</div>
            <div className="text-gray-600">Participations</div>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Informations de Contact */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Informations de Contact</h2>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-700">Nom Complet</span>
              <span className="text-gray-900">{jockey.full_name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-700">Email</span>
              <span className="text-gray-900">{jockey.email}</span>
            </div>
            {jockey.phone && (
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium text-gray-700">Téléphone</span>
                <span className="text-gray-900">{jockey.phone}</span>
              </div>
            )}
            {jockey.address && (
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-700">Adresse</span>
                <span className="text-gray-900">{jockey.address}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Statistiques de Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Statistiques</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{raceCount}</div>
              <div className="text-blue-700">Courses</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{uniqueHorses}</div>
              <div className="text-green-700">Chevaux Montés</div>
            </div>
            <div className="col-span-2 text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">{totalPrizes.toLocaleString('fr-FR')} DT</div>
              <div className="text-yellow-700">Prix Total Gagné</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Historique des Courses */}
      {jockey.jockey_inscriptions && jockey.jockey_inscriptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mt-6"
        >
          <h2 className="text-2xl font-semibent text-gray-900 mb-4">Historique des Courses</h2>
          <div className="space-y-3">
            {jockey.jockey_inscriptions.map((inscription, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{inscription.race?.name}</h3>
                    <p className="text-gray-600">
                      avec {inscription.horse?.name} • {inscription.race?.date && new Date(inscription.race.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">{inscription.race?.prize?.toLocaleString('fr-FR')} DT</div>
                  <div className="text-gray-500">Prix</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Chevaux Montés */}
      {jockey.jockey_inscriptions && jockey.jockey_inscriptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 mt-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Chevaux Montés</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {Array.from(new Set(jockey.jockey_inscriptions.map(inscription => inscription.horse?.id)))
              .map(horseId => {
                const horse = jockey.jockey_inscriptions?.find(inscription => inscription.horse?.id === horseId)?.horse;
                const horseCourses = jockey.jockey_inscriptions?.filter(inscription => inscription.horse?.id === horseId).length || 0;
                
                return horse ? (
                  <div key={horse.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{horse.name}</h3>
                        <p className="text-gray-600">{horseCourses} course{horseCourses > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
