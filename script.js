document.addEventListener("DOMContentLoaded", function() {
    fetch('recipes.json')
        .then(response => response.json())
        .then(data => {
            const recipeName = document.getElementById('recipeName');
            const recipeDescription = document.getElementById('recipeDescription');
            const ingredientList = document.getElementById('ingredientList');

            const recipe = data;
            recipeName.textContent = recipe.name;
            recipeDescription.textContent = recipe.description;

            recipe.ingredient.forEach(ingredient => {
                const listItem = document.createElement('li');
                listItem.textContent = `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`;
                ingredientList.appendChild(listItem);
            });
        })
        .catch(error => console.log('Chyba při načítání receptu:', error));

    const dishCategorySelect = document.getElementById('dishCategory');
    const recipeCategorySelect = document.getElementById('recipeCategory');
    const difficultySelect = document.getElementById('difficulty');
    const priceSelect = document.getElementById('price');
    const toleranceSelect = document.getElementById('tolerance');

    const categories = {
        "dish_category": {
            "1": "Snídaně",
            "2": "Polévka",
            "3": "Hlavní chod",
            "4": "Dezert",
            "5": "Večeře"
        },
        "recipe_category": {
            "1": "Polévka",
            "2": "Maso",
            "3": "Bezmasé jídlo",
            "4": "Dezert",
            "5": "Omáčka",
            "6": "Těstoviny",
            "7": "Salát",
            "8": "Sladké jídlo",
            "9": "Nápoj"
        },
        "difficulty": {
            "1": "Jednoduché",
            "2": "Středně náročné",
            "3": "Náročné"
        },
        "price": {
            "1": "Levné",
            "2": "Střední",
            "3": "Drahé"
        },
        "tolerance": {
            "1": "Vegetariánské",
            "2": "Veganské",
            "3": "Ořechy",
            "4": "Gluten",
            "5": "Laktóza",
            "6": "Koření",
            "7": "Alkohol",
            "8": "Mořské plody",
            "9": "Houby"
        }
    };

    // Funkce pro naplnění rozbalovacích seznamů
    function populateSelect(selectElement, options) {
        for (const key in options) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = options[key];
            selectElement.appendChild(option);
        }
    }

    // Naplnění rozbalovacích seznamů
    populateSelect(dishCategorySelect, categories.dish_category);
    populateSelect(recipeCategorySelect, categories.recipe_category);
    populateSelect(difficultySelect, categories.difficulty);
    populateSelect(priceSelect, categories.price);
    populateSelect(toleranceSelect, categories.tolerance);
});
