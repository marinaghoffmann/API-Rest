const { validationResult } = require('express-validator');
const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');
const { getWeatherByCoords } = require('../services/weatherService');

const create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', errors: errors.array() });
  }

  const { commonName, scientificName, category, latitude, longitude } = req.body;

  try {
    const weatherData = await getWeatherByCoords(latitude, longitude);

    const species = await prisma.species.create({
      data: {
        commonName,
        scientificName,
        category: category.toLowerCase(),
        latitude,
        longitude,
        weatherData,
      },
    });

    return res.status(201).json({ status: 'success', data: { species } });
  } catch (err) {
    return next(err);
  }
};

const findAll = async (req, res, next) => {
  const { category, name, page = 1, limit = 10 } = req.query;

  const where = {};

  if (category) {
    where.category = category.toLowerCase();
  }

  if (name) {
    where.OR = [
      { commonName: { contains: name, mode: 'insensitive' } },
      { scientificName: { contains: name, mode: 'insensitive' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  try {
    const [species, total] = await Promise.all([
      prisma.species.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { registeredAt: 'desc' },
      }),
      prisma.species.count({ where }),
    ]);

    return res.status(200).json({
      status: 'success',
      data: {
        species,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (err) {
    return next(err);
  }
};

const findOne = async (req, res, next) => {
  const { id } = req.params;

  try {
    const species = await prisma.species.findUnique({
      where: { id: Number(id) },
    });

    if (!species) {
      return next(new AppError('Espécie não encontrada.', 404));
    }

    return res.status(200).json({ status: 'success', data: { species } });
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', errors: errors.array() });
  }

  const { id } = req.params;
  const { commonName, scientificName, category, latitude, longitude } = req.body;

  try {
    const existing = await prisma.species.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return next(new AppError('Espécie não encontrada.', 404));
    }

    const newLat = latitude ?? existing.latitude;
    const newLon = longitude ?? existing.longitude;

    let weatherData = existing.weatherData;
    if (latitude || longitude) {
      weatherData = await getWeatherByCoords(newLat, newLon);
    }

    const species = await prisma.species.update({
      where: { id: Number(id) },
      data: {
        ...(commonName && { commonName }),
        ...(scientificName && { scientificName }),
        ...(category && { category: category.toLowerCase() }),
        ...(latitude && { latitude }),
        ...(longitude && { longitude }),
        weatherData,
      },
    });

    return res.status(200).json({ status: 'success', data: { species } });
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  const { id } = req.params;

  try {
    const existing = await prisma.species.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return next(new AppError('Espécie não encontrada.', 404));
    }

    await prisma.species.delete({ where: { id: Number(id) } });

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const byCategory = await prisma.species.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const total = await prisma.species.count();

    const latest = await prisma.species.findMany({
      take: 5,
      orderBy: { registeredAt: 'desc' },
      select: { commonName: true, category: true, registeredAt: true },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        total,
        byCategory: byCategory.map((item) => ({
          category: item.category,
          count: item._count.id,
        })),
        latestRegistered: latest,
      },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { create, findAll, findOne, update, remove, getStats };