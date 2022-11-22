module.exports = (sequelize, Sequelize) => {
  const Keyword = sequelize.define("keyword", {
    keywordText: {
      type: Sequelize.STRING
    },
    theme: {
      type: Sequelize.STRING
    },
    theme_uri: {
      type: Sequelize.STRING
    }
  });

  return Keyword;
};