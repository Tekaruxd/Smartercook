document.addEventListener("DOMContentLoaded", function () {
	const recipeList = document.getElementById("recipeList");
	const filterForm = document.getElementById("filterForm");
	let loaded_filterz = {};
	let filters = {}; // Object to store loaded filters
	// Funkce pro skrytí/otevření formuláře
	function toggleCssFilters() {
		if (filterForm.classList.contains("hidden")) {
			filterForm.classList.remove("hidden");
		} else {
			filterForm.classList.add("hidden");
		}
	}

	// Přidání posluchače události na kliknutí na nadpis H2 "Filters"
	document.getElementById("filtrhide").addEventListener("click", function () {
		toggleCssFilters(); // Zavolání funkce pro skrytí/otevření formuláře
	});

	document
		.getElementById("darkModeToggle")
		.addEventListener("click", function () {
			document.body.classList.toggle("dark-mode");
		});

	// Function to load filters from filters.json file
	function loadFilters() {
		fetch("filters.json")
			.then((response) => response.json())
			.then((data) => {
				loaded_filterz = data;

				filters = data; // Save loaded filters to the global variable
				// Update filter selects
				updateFilterSelects();
			})
			.catch((error) => console.log("Error loading filters:", error));
	}

	// Function to update filter selects
	function updateFilterSelects() {
		for (const key in loaded_filterz) {
			const selectElement = document.getElementById(key);
			selectElement.innerHTML = ""; // Clear select element content

			// Add default option to select
			const defaultOption = document.createElement("option");
			defaultOption.value = "";
			defaultOption.textContent = "All";
			selectElement.appendChild(defaultOption);

			// Add options from loaded filters
			for (const value in loaded_filterz[key]) {
				const option = document.createElement("option");
				option.value = value;
				option.textContent = loaded_filterz[key][value];
				selectElement.appendChild(option);
			}
		}
	}

	// Function to display recipes
	function displayRecipes() {
		// Clear recipe list before updating
		recipeList.innerHTML = "";
		fetch("recipes.json")
			.then((response) => response.json())
			.then((data) => {
				// Filter recipes only if there are some filters applied
				const filteredRecipes = filtersExist() ? filterRecipes(data) : data;

				// Display filtered recipes on the page
				filteredRecipes.forEach((recipe) => {
					const recipeItem = document.createElement("div");
					recipeItem.classList.add("recipe");
					// prettier-ignore
					recipeItem.innerHTML = `
                      <h3>${recipe.name}</h3>
                      <p>Dish category: ${loaded_filterz.dish_category[recipe.dish_category.toString()]}</p>
                      <p>Recipe category: ${loaded_filterz.recipe_category[recipe.recipe_category.toString()]}</p>
                      <p>Difficulty: ${loaded_filterz.difficulty[recipe.difficulty.toString()]}</p>
                      <p>${recipe.description}</p>
                  `;
					recipeList.appendChild(recipeItem);
				});
			})
			.catch((error) => console.log("Error loading recipes:", error));
	}

	// Function to check if filters exist
	function filtersExist() {
		for (const key in filters) {
			if (filters[key] !== "") {
				return true;
			}
		}
		return false;
	}

	// Function to filter recipes
	function filterRecipes(data) {
		return data.filter((recipe) => {
			let includeRecipe = true; // Assume recipe will be included

			for (const key in filters) {
				if (filters[key] !== "" && key in recipe) {
					// If key is in recipe and filter is not empty
					if (Array.isArray(recipe[key])) {
						// If it's an array (e.g., recipe_category, tolerance), compare values
						if (!recipe[key].includes(parseInt(filters[key]))) {
							// If filter value is not in recipe array, exclude recipe
							includeRecipe = false;
							break;
						}
					} else {
						// If it's not an array, compare values directly
						if (recipe[key] !== filters[key]) {
							// If values are not the same, exclude recipe
							includeRecipe = false;
							break;
						}
					}
				}
			}
			return includeRecipe;
		});
	}

	// Handle form submission for filtering
	filterForm.addEventListener("submit", function (event) {
		event.preventDefault(); // Prevent default form behavior
		// Load filter values from form inputs
		filters = {
			dish_category: dish_category.value,
			recipe_category: recipe_category.value,
			difficulty: difficulty.value,
			unit: unit.value,
			price: price.value,
			tolerance: tolerance.value,
		};
		displayRecipes();
	});

	loadFilters();
	displayRecipes(); // Display all recipes on initial page load
});
