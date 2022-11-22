module.exports = app => {
  const keywords = require("../controllers/keyword.controller.js");

  var router = require("express").Router();

  // Create a new Keyword
  router.post("/", keywords.create);

  // Retrieve all Keywords
  router.get("/", keywords.findAll);

  // Retrieve all published Keywords
  //router.get("/published", keywords.findAllPublished);

  // Retrieve a single Keyword with id
  router.get("/:id", keywords.findOne);

  // Update a Keyword with id
  router.put("/:id", keywords.update);

  // Delete a Keyword with id
  router.delete("/:id", keywords.delete);

  // Create a new Keyword
  router.delete("/", keywords.deleteAll);

  app.use('/api/keywords', router);
};