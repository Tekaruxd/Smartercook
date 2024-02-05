document.addEventListener("DOMContentLoaded", function () {
	const recipeList = document.getElementById("recipeList");
	const filterForm = document.getElementById("filterForm");
	let filters = {}; // Objekt pro uchování načtených filtrů

	// Funkce pro načtení filtrů ze souboru filtry.json
	function loadFilters() {
		fetch("filtry.json")
			.then((response) => response.json())
			.then((data) => {
				filters = data; // Uložení načtených filtrů do globální proměnné
				// Aktualizace rozbalovacích seznamů s filtry
				updateFilterSelects();
			})
			.catch((error) => console.log("Chyba při načítání filtrů:", error));
	}

	// Funkce pro aktualizaci rozbalovacích seznamů s filtry
	function updateFilterSelects() {
		for (const key in filters) {
			const selectElement = document.getElementById(key);
			selectElement.innerHTML = ""; // Vyprázdnění obsahu rozbalovacího seznamu

			// Přidání možností do rozbalovacího seznamu
			const defaultOption = document.createElement("option");
			defaultOption.value = "";
			defaultOption.textContent = "Všechny";
			selectElement.appendChild(defaultOption);

			// Přidání možností z načtených filtrů
			for (const value in filters[key]) {
				const option = document.createElement("option");
				option.value = value;
				option.textContent = filters[key][value];
				selectElement.appendChild(option);
			}
		}
	}

	// Funkce pro načtení receptů a jejich zobrazení
	function displayRecipes() {
		// Vyprázdnit seznam receptů před aktualizací
		recipeList.innerHTML = "";

		// Načtení receptů z JSON souboru
		fetch("recepty.json")
			.then((response) => response.json())
			.then((data) => {
				// Filtrace receptů podle zvolených filtrů
				const filteredRecipes = data.filter((recipe) => {
					let includeRecipe = true; // Předpokládáme, že recept bude zahrnut

					for (const key in filters) {
						if (filters[key] !== "" && key in recipe) {
							// Pokud je klíč v receptu a nebyl vybrán prázdný filtr
							if (Array.isArray(recipe[key])) {
								// Pokud se jedná o pole (např. recipe_category, tolerance), porovnáme hodnoty
								if (!recipe[key].includes(parseInt(filters[key]))) {
									// Pokud hodnota filtru není obsažena v poli receptu, vyloučíme recept
									includeRecipe = false;
									break;
								}
							} else {
								// Pokud se nejedná o pole, porovnáme přímo hodnoty
								if (recipe[key] !== filters[key]) {
									// Pokud hodnoty nejsou shodné, vyloučíme recept
									includeRecipe = false;
									break;
								}
							}
						}
					}
					return includeRecipe;
				});

				// Zobrazení filtrovaných receptů na stránce
				filteredRecipes.forEach((recipe) => {
					const recipeItem = document.createElement("div");
					recipeItem.classList.add("recipe");
					recipeItem.innerHTML = `
                          <h3>${recipe.name}</h3>
                          <p>${recipe.dish_category}</p>
                          <p>${recipe.description}</p>

                      `;
					recipeList.appendChild(recipeItem);
				});
			})
			.catch((error) => console.log("Chyba při načítání receptů:", error));
	}

	// Obsluha formuláře pro filtrování
	filterForm.addEventListener("submit", function (event) {
		event.preventDefault(); // Zabránit výchozímu chování formuláře
		// Načtení hodnot filtrů ze vstupů formuláře
		filters = {
			dish_category: dish_category.value,
			recipe_category: recipe_category.value,
			difficulty: difficulty.value,
			price: price.value,
			tolerance: tolerance.value,
		};

		displayRecipes(); // Zobrazit recepty podle zvolených filtrů
	});

	// Načtení filtrů ze souboru při načtení stránky
	loadFilters();
	// Načtení receptů při načtení stránky
	displayRecipes(); // Zobrazit všechny recepty při prvním načtení stránky
});
