// src/models/user.ts

let Sequelize = require("sequelize");
let { sequelize } = require('../dbconf');


const Recipe_Ingredients= sequelize.define('recipe_ingredients', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    recipeID: Sequelize.INTEGER,
    ingredientID: Sequelize.INTEGER,
    quantity: Sequelize.TEXT
},{
     
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})

module.exports = { Recipe_Ingredients }