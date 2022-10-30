let path = require("path");
let { Sequelize } = require("sequelize")

const sequelize = new Sequelize(/*"sqlite:: recipes",*/ {
    dialect: "sqlite",
    storage: path.join(__dirname, '.', 'recipe.db'),

})

sequelize.authenticate()


module.exports = { sequelize }