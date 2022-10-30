// src/models/user.ts

let Sequelize = require("sequelize");
let { sequelize } = require('../dbconf');


const Recipes = sequelize.define('recipes', {
    recipeID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING,
    category: Sequelize.STRING,
    cuisine: Sequelize.STRING,
    ingredients: Sequelize.STRING,
    instructions: Sequelize.STRING,
    makesSize: Sequelize.INTEGER,
    notes: Sequelize.TEXT,
    image: Sequelize.STRING
},{
     
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})

module.exports = { Recipes }