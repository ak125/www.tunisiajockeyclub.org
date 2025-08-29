import React from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Calendar, MapPin } from 'lucide-react';

interface HorseData {
  id: string;
  name: string;
  birth_date: string;
  sex: string;
  color: string;
  father: string;
  mother: string;
  owner?: User;
  trainer?: User;
  inscriptions?: Array<{
    race: {
      id: string;
      name: string;
      date: string;
      prize: number;
    };
  }>;
}

interface User {
  id: string;
  full_name: string;
  email: string;
}

interface HorseProfileProps {
  horse: HorseData;
}

export function HorseProfile({ horse }: HorseProfileProps) {
  const age = new Date().getFullYear() - new Date(horse.birth_date).getFullYear();
  const totalPrizes = horse.inscriptions?.reduce((sum, inscription) => sum + (inscription.race?.prize || 0), 0) || 0;
  const raceCount = horse.inscriptions?.length || 0;

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{horse.name}</h1>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {horse.sex === 'stallion' ? 'Étalon' : 'Jument'} • {horse.color}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {age} ans • Né(e) le {new Date(horse.birth_date).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{raceCount}</div>
            <div className="text-gray-600">Courses</div>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Informations Généales */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Informations Générales</h2>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-700">Nom</span>
              <span className="text-gray-900">{horse.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-700">Sexe</span>
              <span className="text-gray-900">{horse.sex === 'stallion' ? 'Étalon' : 'Jument'}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-700">Couleur</span>
              <span className="text-gray-900">{horse.color}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-700">Âge</span>
              <span className="text-gray-900">{age} ans</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium text-gray-700">Date de naissance</span>
              <span className="text-gray-900">{new Date(horse.birth_date).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </motion.div>

        {/* Pedigree */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pedigree</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Père</h3>
              <p className="text-blue-800">{horse.father}</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <h3 className="font-semibold text-pink-900 mb-2">Mère</h3>
              <p className="text-pink-800">{horse.mother}</p>
            </div>
          </div>
        </motion.div>

        {/* Connections */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Équipe</h2>
          <div className="space-y-4">
            {horse.owner && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">Propriétaire</h3>
                  <p className="text-gray-600">{horse.owner.full_name}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
              </div>
            )}
            {horse.trainer && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">Entraîneur</h3>
                  <p className="text-gray-600">{horse.trainer.full_name}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Statistiques</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{raceCount}</div>
              <div className="text-green-700">Courses</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">{totalPrizes.toLocaleString('fr-FR')} DT</div>
              <div className="text-yellow-700">Prix Total</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Historique des Courses */}
      {horse.inscriptions && horse.inscriptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mt-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Historique des Courses</h2>
          <div className="space-y-3">
            {horse.inscriptions.map((inscription, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{inscription.race?.name}</h3>
                    <p className="text-gray-600">
                      {inscription.race?.date && new Date(inscription.race.date).toLocaleDateString('fr-FR')}
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
    </div>
  );
}
