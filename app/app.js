const express = require('express');

const app = express();
const { authRouter, withoutAuthRouter } = require('./router');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', withoutAuthRouter);
app.use('/api/v1', authRouter);

module.exports = app;
