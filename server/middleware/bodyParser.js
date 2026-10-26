const express = require("express");
const { BODY_PARSER_LIMIT } = require("../config/constants");

const bodyParser = [
  express.json({ limit: BODY_PARSER_LIMIT }),
  express.urlencoded({ extended: true, limit: BODY_PARSER_LIMIT }),
];

module.exports = bodyParser;
