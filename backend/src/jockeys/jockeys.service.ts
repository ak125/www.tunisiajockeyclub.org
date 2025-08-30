import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdvancedCacheService } from '../cache/advanced-cache.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class JockeysService {
  private readonly logger = new Logger(JockeysService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: AdvancedCacheService,
  ) {}

  async getAllJockeys(options: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = 'licenseNumber',
      sortOrder = 'asc',
    } = options;

    const skip = (page - 1) * limit;
    const cacheKey = `jockeys:all:${page}:${limit}:${search || 'none'}:${sortBy}:${sortOrder}`;

    try {
      // Vérifier le cache en premier
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        this.logger.debug(`✅ Jockeys récupérés depuis le cache`);
        return cached;
      }

      // Construction de la condition de recherche
      const where: Prisma.JockeyWhereInput = search
        ? {
            OR: [
              {
                licenseNumber: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                user: {
                  OR: [
                    {
                      firstName: {
                        contains: search,
                        mode: 'insensitive',
                      },
                    },
                    {
                      lastName: {
                        contains: search,
                        mode: 'insensitive',
                      },
                    },
                  ],
                },
              },
            ],
          }
        : {};

      // Construction de l'ordre de tri
      const orderBy: Prisma.JockeyOrderByWithRelationInput = {};
      if (sortBy === 'name') {
        orderBy.user = {
          lastName: sortOrder,
        };
      } else if (sortBy === 'wins') {
        orderBy.wins = sortOrder;
      } else if (sortBy === 'licenseNumber') {
        orderBy.licenseNumber = sortOrder;
      } else if (sortBy === 'places') {
        orderBy.places = sortOrder;
      } else if (sortBy === 'shows') {
        orderBy.shows = sortOrder;
      } else {
        // Fallback vers licenseNumber si le champ n'est pas reconnu
        orderBy.licenseNumber = sortOrder;
      }

      // Récupération des jockeys avec les informations utilisateur
      const [jockeys, totalCount] = await Promise.all([
        this.prisma.jockey.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                country: true,
              },
            },
            _count: {
              select: {
                raceEntries: true,
                raceResults: true,
              },
            },
          },
        }),
        this.prisma.jockey.count({ where }),
      ]);

      // Formatage des données
      const formattedJockeys = jockeys.map((jockey) => ({
        id: jockey.id,
        licenseNumber: jockey.licenseNumber,
        name: jockey.user
          ? `${jockey.user.firstName || ''} ${jockey.user.lastName || ''}`.trim()
          : 'Jockey Anonyme',
        firstName: jockey.user?.firstName,
        lastName: jockey.user?.lastName,
        email: jockey.user?.email,
        phone: jockey.user?.phone,
        nationality: jockey.user?.country || 'Tunisie',
        weightKg: jockey.weightKg ? parseFloat(jockey.weightKg.toString()) : null,
        heightCm: jockey.heightCm,
        wins: jockey.wins,
        places: jockey.places,
        shows: jockey.shows,
        totalRaces: jockey._count.raceEntries,
        winPercentage:
          jockey._count.raceEntries > 0
            ? Math.round((jockey.wins / jockey._count.raceEntries) * 100 * 100) / 100
            : 0,
        isActive: jockey.isActive,
        createdAt: jockey.createdAt,
      }));

      const result = {
        jockeys: formattedJockeys,
        pagination: {
          current: page,
          total: Math.ceil(totalCount / limit),
          count: formattedJockeys.length,
          totalRecords: totalCount,
        },
        meta: {
          timestamp: new Date().toISOString(),
          source: 'database',
          note: 'Données récupérées depuis la base de données Supabase',
        },
      };

      // Mettre en cache pendant 10 minutes
      await this.cacheService.set(cacheKey, result, 600);

      this.logger.log(`✅ ${formattedJockeys.length} jockeys récupérés depuis la base de données`);
      return result;

    } catch (error) {
      this.logger.error(`❌ Erreur lors de la récupération des jockeys:`, error);

      // Données de fallback en cas d'erreur
      const fallbackJockeys = this.generateFallbackJockeys(limit);
      const result = {
        jockeys: fallbackJockeys,
        pagination: {
          current: page,
          total: 1,
          count: fallbackJockeys.length,
          totalRecords: fallbackJockeys.length,
        },
        meta: {
          timestamp: new Date().toISOString(),
          source: 'fallback',
          note: 'Base de données non disponible - données de démonstration',
        },
      };

      return result;
    }
  }

  async getJockeyById(id: string) {
    const cacheKey = `jockey:${id}`;

    try {
      // Vérifier le cache
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      const jockey = await this.prisma.jockey.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              country: true,
              dateOfBirth: true,
              address: true,
              city: true,
            },
          },
          raceEntries: {
            include: {
              race: {
                select: {
                  id: true,
                  name: true,
                  raceDate: true,
                  racecourse: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              horse: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              race: {
                raceDate: 'desc',
              },
            },
            take: 10,
          },
          raceResults: {
            include: {
              race: {
                select: {
                  id: true,
                  name: true,
                  raceDate: true,
                  prizeMoney: true,
                },
              },
            },
            orderBy: {
              race: {
                raceDate: 'desc',
              },
            },
            take: 10,
          },
          _count: {
            select: {
              raceEntries: true,
              raceResults: true,
            },
          },
        },
      });

      if (!jockey) {
        throw new NotFoundException(`Jockey avec l'ID ${id} non trouvé`);
      }

      const result = {
        id: jockey.id,
        licenseNumber: jockey.licenseNumber,
        name: jockey.user
          ? `${jockey.user.firstName || ''} ${jockey.user.lastName || ''}`.trim()
          : 'Jockey Anonyme',
        firstName: jockey.user?.firstName,
        lastName: jockey.user?.lastName,
        email: jockey.user?.email,
        phone: jockey.user?.phone,
        nationality: jockey.user?.country || 'Tunisie',
        dateOfBirth: jockey.user?.dateOfBirth,
        address: jockey.user?.address,
        city: jockey.user?.city,
        weightKg: jockey.weightKg ? parseFloat(jockey.weightKg.toString()) : null,
        heightCm: jockey.heightCm,
        wins: jockey.wins,
        places: jockey.places,
        shows: jockey.shows,
        totalRaces: jockey._count.raceEntries,
        winPercentage:
          jockey._count.raceEntries > 0
            ? Math.round((jockey.wins / jockey._count.raceEntries) * 100 * 100) / 100
            : 0,
        isActive: jockey.isActive,
        createdAt: jockey.createdAt,
        recentRaces: jockey.raceEntries.map((entry) => ({
          id: entry.race.id,
          name: entry.race.name,
          date: entry.race.raceDate,
          racecourse: entry.race.racecourse.name,
          horse: entry.horse.name,
          clothNumber: entry.clothNumber,
        })),
        recentResults: jockey.raceResults.map((result) => ({
          id: result.race.id,
          name: result.race.name,
          date: result.race.raceDate,
          position: result.position,
          prizeMoney: result.race.prizeMoney
            ? parseFloat(result.race.prizeMoney.toString())
            : null,
        })),
      };

      // Mettre en cache pendant 30 minutes
      await this.cacheService.set(cacheKey, result, 1800);

      return result;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(`❌ Erreur lors de la récupération du jockey ${id}:`, error);

      // Données de fallback
      return this.generateFallbackJockey(id);
    }
  }

  async getTopJockeys(limit = 10) {
    const cacheKey = `jockeys:top:${limit}`;

    try {
      // Vérifier le cache
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      const topJockeys = await this.prisma.jockey.findMany({
        take: limit,
        where: {
          isActive: true,
        },
        orderBy: [
          { wins: 'desc' },
          { places: 'desc' },
        ],
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              country: true,
            },
          },
          _count: {
            select: {
              raceResults: true,
            },
          },
        },
      });

      const result = {
        jockeys: topJockeys.map((jockey, index) => ({
          rank: index + 1,
          id: jockey.id,
          licenseNumber: jockey.licenseNumber,
          name: jockey.user
            ? `${jockey.user.firstName || ''} ${jockey.user.lastName || ''}`.trim()
            : 'Jockey Anonyme',
          nationality: jockey.user?.country || 'Tunisie',
          wins: jockey.wins,
          places: jockey.places,
          shows: jockey.shows,
          totalRaces: jockey._count.raceResults,
          winPercentage:
            jockey._count.raceResults > 0
              ? Math.round((jockey.wins / jockey._count.raceResults) * 100 * 100) / 100
              : 0,
        })),
        meta: {
          timestamp: new Date().toISOString(),
          source: 'database',
        },
      };

      // Mettre en cache pendant 15 minutes
      await this.cacheService.set(cacheKey, result, 900);

      return result;

    } catch (error) {
      this.logger.error(`❌ Erreur lors de la récupération du top jockeys:`, error);

      // Données de fallback
      return {
        jockeys: this.generateFallbackTopJockeys(limit),
        meta: {
          timestamp: new Date().toISOString(),
          source: 'fallback',
        },
      };
    }
  }

  private generateFallbackJockeys(count = 10) {
    return Array.from({ length: count }, (_, i) => ({
      id: `jockey-${i + 1}`,
      licenseNumber: `JOC${String(i + 1).padStart(4, '0')}`,
      name: `Jockey ${i + 1}`,
      firstName: `Prénom${i + 1}`,
      lastName: `Nom${i + 1}`,
      email: `jockey${i + 1}@example.com`,
      nationality: 'Tunisie',
      weightKg: 55 + Math.random() * 10,
      heightCm: 160 + Math.floor(Math.random() * 15),
      wins: Math.floor(Math.random() * 50),
      places: Math.floor(Math.random() * 30),
      shows: Math.floor(Math.random() * 20),
      totalRaces: Math.floor(Math.random() * 100) + 50,
      winPercentage: Math.floor(Math.random() * 30) + 10,
      isActive: true,
      createdAt: new Date(),
    }));
  }

  private generateFallbackJockey(id: string) {
    return {
      id,
      licenseNumber: `JOC${id.slice(-4).toUpperCase()}`,
      name: `Jockey Démonstration`,
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'jockey@example.com',
      nationality: 'Tunisie',
      weightKg: 58.5,
      heightCm: 168,
      wins: 25,
      places: 18,
      shows: 12,
      totalRaces: 85,
      winPercentage: 29.4,
      isActive: true,
      createdAt: new Date(),
      recentRaces: [],
      recentResults: [],
    };
  }

  private generateFallbackTopJockeys(limit: number) {
    return Array.from({ length: limit }, (_, i) => ({
      rank: i + 1,
      id: `top-jockey-${i + 1}`,
      licenseNumber: `TOP${String(i + 1).padStart(3, '0')}`,
      name: `Top Jockey ${i + 1}`,
      nationality: 'Tunisie',
      wins: 100 - i * 10,
      places: 80 - i * 8,
      shows: 60 - i * 6,
      totalRaces: 200 - i * 15,
      winPercentage: Math.max(50 - i * 3, 15),
    }));
  }
}
