let express = require("express");
let path = require("path");
let { Sequelie, where } = require("sequelize");
const { engine } = require ('express-handlebars');

const app = express();
const port = 8080;

//Loads the handlebars module
const handlebars = require('express-handlebars');
let { Recipes } = require("./models/recipes");
let { Recipe_Ingredients } = require("./models/recipe_ingredients");
let { Ingredients } = require("./models/ingredients");


app.set('view engine', 'hbs');
app.engine('hbs', engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs'
}));


app.use(express.static('public'))
app.get('/', (req, res) => {
    res.redirect("/recipes");
    //res.render('main', {layout : 'index'});
});



app.post('/addIngredient', (req, res) => {
    
    if(!req.query.name) return res.sendStatus(400);
    Ingredients.create({name: req.query.name});
    res.sendStatus(200);
})

app.post('/addRecipeIngredient', (req, res) => {
    if(!req.query.recipe || !req.query.ingredient || !req.query.quantity) return res.sendStatus(400);
    Recipe_Ingredients.create({ingredientID: parseInt(req.query.ingredient), recipeID: parseInt(req.query.recipe), quantity: req.query.quantity});
    res.sendStatus(200);
})

app.post('/addRecipe', (req, res) => {
    
    if(!req.query.name) return res.sendStatus(400);
    Recipes.create({
        name: req.query.name, 
        category: req.query.category, 
        cuisine: req.query.cuisine, 
        instructions: req.query.instructions,
        makesSize: req.query.makesSize,
        notes: req.query.notes,
        image: req.query.image
    });
    res.sendStatus(200);
})

app.get('/addRecipe', (req, res) => {
    res.render("addRecipe", {layout: 'index'})
})

app.get("/recipes", async (req, res) => {
    let allRecipes = await getAllRecipes();
    
    let randomRecipesArray = allRecipes.sort(() => .5 - Math.random()).slice(0,7)
    res.render("recipes", {layout: "index", post: {randomRecipesArray}});
})


app.get("/addRecipeIngredient", async (req, res) => {
    let recipesArr = await getAllRecipes();
    let ingredientsArr = await getAllIngredients();
    
    res.render("addRecipeIngredient", {layout: "index", post: {recipesArr, ingredientsArr}})
})

app.get('/recipe', (req, res) => {
    console.log(req.query.recipeID) 

    if(!req.query.recipeID) return res.redirect("/");
    
    
    Recipes.findOne({where: { recipeID: req.query.recipeID }}).then(async recipeData =>{
        //Recipe data is an array of recipes that we need to loop through;
        let ingredients = await Recipe_Ingredients.findAll({where: { recipeID: recipeData.dataValues.recipeID }});

        //The ingredientsArry in recipeObj will be an array of RecipeIngredients objects with quantity and ingredient name only
        let ingredientsArr = [];
        for(let f = 0; f < ingredients.length; f++){
            let ingredientName = await Ingredients.findOne({where: { ingredientID: ingredients[f].dataValues.ingredientID }});
            ingredientName = ingredientName.dataValues.name;
            ingredientsArr[f] = { name: ingredientName, quantity: ingredients[f].dataValues.quantity }
        }

        //Ingredients of every single Recipe
        let recipeObj = {
            recipeID: recipeData.dataValues.recipeID,
            recipeName: recipeData.dataValues.name,
            category: recipeData.dataValues.category,
            cuisine: recipeData.dataValues.cuisine,
            instructions: recipeData.dataValues.instructions,
            servingSize: recipeData.dataValues.makesSize,
            recipeNotes: recipeData.dataValues.notes,
            ingredients: ingredientsArr,
            image: recipeData.dataValues.image
        }
        res.render("recipe", {layout: "index", post: {recipeObj}});
    })
})

async function getAllIngredients(){
    let ingredientArr = [];
    let ingredientData = await Ingredients.findAll();
    ingredientData.forEach(ingredient => {
        ingredientArr.push({ ingredientID: ingredient.dataValues.ingredientID, name: ingredient.dataValues.name })
        
    });

    return Promise.resolve(ingredientArr);
}

/**
 * 
 * @returns Array of recipes
 */
async function getAllRecipes(){
    let recipesArr = [];
    let recipeData = await Recipes.findAll()
    
    //Recipe data is an array of recipes that we need to loop through;

    for (let i = 0; i < recipeData.length; i++) {
        let ingredients = await Recipe_Ingredients.findAll({where: { recipeID: recipeData[i].recipeID }});

        //The ingredientsArry in recipeObj will be an array of RecipeIngredients objects with quantity and ingredient name only
        let ingredientsArr = [];
        for(let f = 0; f < ingredients.length; f++){
            let ingredientName = await Ingredients.findOne({where: { ingredientID: ingredients[f].dataValues.ingredientID }});
            ingredientName = ingredientName.dataValues.name;
            ingredientsArr[f] = { name: ingredientName, quantity: ingredients[f].dataValues.quantity }
        }

        //Ingredients of every single Recipe
        let recipeObj = {
            recipeID: recipeData[i].recipeID,
            recipeName: recipeData[i].name,
            category: recipeData[i].category,
            cuisine: recipeData[i].cuisine,
            instructions: recipeData[i].instructions,
            servingSize: recipeData[i].makesSize,
            recipeNotes: recipeData[i].notes,
            ingredients: ingredientsArr,
            image: recipeData[i].image
        }

        recipesArr.push(recipeObj);
    }

    return Promise.resolve(recipesArr);
}



app.listen(port, () => console.log(`App listening to port ${port}`));