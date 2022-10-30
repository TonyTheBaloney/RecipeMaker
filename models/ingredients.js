// src/models/user.ts

let Sequelize = require("sequelize");
let { sequelize } = require('../dbconf');


const Ingredients= sequelize.define('ingredients', {
    ingredientID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.TEXT
},{
     
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})

module.exports = { Ingredients }