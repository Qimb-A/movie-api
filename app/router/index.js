const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middlewares/auth');

const authRouter = express.Router();
const withoutAuthRouter = express.Router();
const user = require('../controllers/user');
const movie = require('../controllers/movie');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/source/');
  },

  filename(req, file, cb) {
    cb(null, `${new Date().toISOString().replaceAll(/-|T|:|Z|\s|\./gm, '')}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

withoutAuthRouter
  .post('/users', user.create)
  .post('/sessions', user.sessions);

authRouter
  .use(auth)
  .post('/movies', movie.create)
  .delete('/movies/:id', movie.deleteMovie)
  .patch('/movies/:id', movie.update)
  .get('/movies', movie.getList)
  .post('/movies/import', upload.single('movies'), movie.importFromFile)
  .get('/source/:fileName', movie.getSourceFile);
module.exports = {
  authRouter,
  withoutAuthRouter,
};
