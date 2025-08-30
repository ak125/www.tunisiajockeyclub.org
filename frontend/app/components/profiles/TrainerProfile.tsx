import React from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Calendar, Star, Award } from 'lucide-react';

interface Horse {
  id: string;
  name: string;
  sex: string;
  color: string;
}

interface TrainerData {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  trained_horses?: Horse[];
}

interface TrainerProfileProps {
  trainer: TrainerData;
}

export function TrainerProfile({ trainer }: TrainerProfileProps) {
  const horsesCount = trainer.trained_horses?.length || 0;

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{trainer.full_name}</h1>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Entraîneur Professionnel
              </span>
              <span className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                {horsesCount} Chevaux
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{horsesCount}</div>
            <div className="text-gray-600">Chevaux Entraînés</div>
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
              <span className="text-gray-900">{trainer.full_name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-700">Email</span>
              <span className="text-gray-900">{trainer.email}</span>
            </div>
            {trainer.phone && (
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium text-gray-700">Téléphone</span>
                <span className="text-gray-900">{trainer.phone}</span>
              </div>
            )}
            {trainer.address && (
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-700">Adresse</span>
                <span className="text-gray-900">{trainer.address}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Statistiques</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{horsesCount}</div>
              <div className="text-green-700">Chevaux Entraînés</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {trainer.trained_horses?.filter(h => h.sex === 'stallion').length || 0}
              </div>
              <div className="text-blue-700">Étalons</div>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <div className="text-3xl font-bold text-pink-600">
                {trainer.trained_horses?.filter(h => h.sex === 'mare').length || 0}
              </div>
              <div className="text-pink-700">Juments</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">
                {new Set(trainer.trained_horses?.map(h => h.color)).size}
              </div>
              <div className="text-yellow-700">Couleurs</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chevaux Entraînés */}
      {trainer.trained_horses && trainer.trained_horses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mt-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Écurie</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainer.trained_horses.map((horse) => (
              <div key={horse.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{horse.name}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{horse.sex === 'stallion' ? 'Étalon' : 'Jument'}</p>
                      <p className="capitalize">{horse.color}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Répartition par Sexe */}
      {trainer.trained_horses && trainer.trained_horses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 mt-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Répartition de l'Écurie</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Étalons */}
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Étalons ({trainer.trained_horses.filter(h => h.sex === 'stallion').length})
              </h3>
              <div className="space-y-2">
                {trainer.trained_horses
                  .filter(h => h.sex === 'stallion')
                  .map(horse => (
                    <div key={horse.id} className="p-2 bg-blue-50 rounded text-blue-900">
                      {horse.name} • {horse.color}
                    </div>
                  ))}
              </div>
            </div>

            {/* Juments */}
            <div>
              <h3 className="text-lg font-semibold text-pink-900 mb-3">
                Juments ({trainer.trained_horses.filter(h => h.sex === 'mare').length})
              </h3>
              <div className="space-y-2">
                {trainer.trained_horses
                  .filter(h => h.sex === 'mare')
                  .map(horse => (
                    <div key={horse.id} className="p-2 bg-pink-50 rounded text-pink-900">
                      {horse.name} • {horse.color}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
