const db = require("../models");
const Keyword = db.keywords;
const Op = db.Sequelize.Op;

// Create and Save a new Keyword
exports.create = (req, res) => {
  // Validate request
  if (!req.body.keywordText) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Keyword
  const keyword = {
    keywordText: req.body.keywordText,
    theme: req.body.theme,
    theme_uri: req.body.theme_uri
  };

  // Save Keyword in the database
  Keyword.create(keyword)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Keyword."
      });
    });
};

// Retrieve all Keywords from the database.
exports.findAll = (req, res) => {
  const keywordText = req.query.keywordText;
  const theme = req.query.theme;
 
  var conditionK = keywordText ? { keywordText: { [Op.iLike]: `%${keywordText}%` } } : null;
  var conditionT = theme ? { theme: { [Op.iLike]: `%${theme}%` } } : null;

  Keyword.findAll({ where:  {[Op.and]: [conditionK,conditionT] } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving keywords."
      });
    });
};

// Find a single Keyword with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Keyword.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Keyword with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Keyword with id=" + id
      });
    });
};

// Update a Keyword by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Keyword.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Keyword was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Keyword with id=${id}. Maybe Keyword was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Keyword with id=" + id
      });
    });
};

// Delete a Keyword with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Keyword.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Keyword was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Keyword with id=${id}. Maybe Keyword was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Keyword with id=" + id
      });
    });
};

// Delete all Keywords from the database.
exports.deleteAll = (req, res) => {
  Keyword.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Keywords were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all keywords."
      });
    });
};

// Find all published Keywords
/*exports.findAllPublished = (req, res) => {
  Keyword.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving keywords."
      });
    });
};*/