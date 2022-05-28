/* eslint-disable prefer-destructuring */
const fs = require('fs/promises');
const config = require('config');
const Movie = require('../models/movie');
const Actor = require('../models/actor');
const errorHandler = require('../helpers/errorHandler');

const create = async (req, res) => {
  const { body } = req;
  body.actors = body.actors.map((name) => ({ name }));
  try {
    res.status(201).send({ status: 1, data: await Movie.create(body, { include: [{ model: Actor, as: 'actors' }] }) });
  } catch (err) {
    res.status(400).send(errorHandler(err));
  }
};

const deleteMovie = async (req, res) => {
  const { id } = req.params;
  const deletedCount = await Movie.destroy({ where: { id } });
  if (deletedCount) res.send({ status: 1 });
  else {
    res.status(404).send({
      status: 0,
      error: {
        fields: {
          id,
        },
        code: 'MOVIE_NOT_FOUND',
      },
    });
  }
};

const update = async (req, res) => {
  const { body } = req;
  const { id } = req.params;
  body.actors = body.actors.map((name) => ({ name }));
  let result = await Movie.findByPk(id);
  if (result) {
    await result.destroy();
    result = await Movie.create({ ...body, id }, { include: [{ model: Actor, as: 'actors' }] });
    res.send({ status: 1, data: result });
  } else {
    res.status(404).send({
      status: 0,
      error: {
        fields: {
          id,
        },
        code: 'MOVIE_NOT_FOUND',
      },
    });
  }
};

const getList = async (req, res) => {
  const { query } = req;
  const movieWhere = query.search ? { title: query.search } : undefined;
  const actorWhere = (query.search || query.actor) ? { name: query.search || query.actor }
    : undefined;
  let result = await Movie.findAll(
    {
      offset: query.offset ?? 0,
      limit: query.limit ?? 20,
      order: [[query.sort ?? 'id', query.order ?? 'ASC']],
      where: movieWhere,
      include: [{
        model: Actor,
        as: 'actors',
        attributes: [],
        through: { attributes: [] },
      }],
    },
  );
  if (actorWhere) {
    await Movie.findAll({
      offset: query.offset ?? 0,
      limit: query.limit ?? 20,
      order: [[query.sort ?? 'id', query.order ?? 'ASC']],
      include: [{
        model: Actor,
        as: 'actors',
        where: actorWhere,
        attributes: [],
        through: { attributes: [] },
      }],
    }).then((qsRes) => {
      result = result.filter((movieA) => !qsRes.some((movieB) => movieA.id === movieB.id));
      result = [...result, ...qsRes];
    });
  }
  res.send(result);
};

const importFromFile = async (req, res) => {
  const { filename: movies } = req.file;
  const data = await fs.readFile(`./public/source/${movies}`, 'utf-8');
  const rawArr = data.toString().replace(/\r\n/g, '\n').split('\n');
  const dataArr = [];
  let tempObj = {};
  rawArr.forEach((line) => {
    const lineArr = line.split(':');
    if (lineArr[0] === 'Title') tempObj.title = lineArr[1].trim();
    if (lineArr[0] === 'Release Year') tempObj.year = lineArr[1].trim();
    if (lineArr[0] === 'Format') tempObj.format = lineArr[1].trim();
    if (lineArr[0] === 'Stars') {
      tempObj.actors = lineArr[1].split(',').map((name) => ({ name }));
    }
    if (lineArr[0] === '') {
      tempObj.source = `http://localhost:${config.server.port}/api/v1/source/${movies}`;
      if (Object.keys(tempObj).length > 3) {
        dataArr.push(tempObj);
      }
      tempObj = {};
    }
  });
  try {
    const qsResult = await Movie.bulkCreate(dataArr, { include: [{ model: Actor, as: 'actors' }] });
    res.status(201).send({
      data: qsResult, status: 1, meta: { imported: dataArr.length, total: dataArr.length },
    });
  } catch (err) {
    res.status(400).send(errorHandler(err));
  }
};

const getSourceFile = async (req, res) => {
  const { fileName } = req.params;
  res.sendFile(`${process.cwd()}/public/source/${fileName}`);
};

module.exports = {
  create,
  deleteMovie,
  update,
  getList,
  importFromFile,
  getSourceFile,
};
