import { API_URL, KEY, RES_PER_PAGE } from "./config.js";
import { AJAX } from "./helpers.js";

// Initial state object to store data for the application
export const state = {
  recipe: {}, // Stores the current recipe object
  search: { query: "", results: [], resultsPerPage: RES_PER_PAGE, page: 1 }, // Stores search query and results
  bookmarks: [], // Stores bookmarked recipes
  shoppingList: [], // Stores ingredients added to the shopping list
};

/**
 * Helper function to format the recipe object.
 * @param {Object} data - The raw recipe data from the API.
 * @returns {Object} - A formatted recipe object with key properties.
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data; // Destructure recipe object from API response

  return (state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // Conditionally add 'key' if it exists
  });
};

/**
 * Load a recipe by its ID from the API.
 * @param {string} id - The ID of the recipe to load.
 */
export const loadRecipe = async function (id) {
  try {
    // Fetch recipe data using the provided API URL and recipe ID
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    // Format and store the recipe in the state
    state.recipe = createRecipeObject(data);

    // Check if the recipe is bookmarked and update the bookmark state
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.log(`${err} 💥💥💥💥`);
    throw err; // Rethrow error for further handling
  }
};

/**
 * Load search results based on the query from the API.
 * @param {string} query - The search query entered by the user.
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query; // Store search query in the state

    // Fetch search results from the API
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    // Format search results and store them in the state
    state.search.results = data.data.recipes.map(rec => ({
      id: rec.id,
      title: rec.title,
      publisher: rec.publisher,
      image: rec.image_url,
      ...(rec.key && { key: rec.key }), // Conditionally add 'key' if it exists
    }));
    state.search.page = 1; // Reset to the first page of results
  } catch (err) {
    console.log(`${err} 💥💥💥💥`);
    throw err; // Rethrow error for further handling
  }
};

/**
 * Get search results for a specific page.
 * @param {number} [page=state.search.page] - The page number to retrieve.
 * @returns {Array} - A slice of search results for the current page.
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page; // Update current page in state

  const start = (page - 1) * state.search.resultsPerPage; // Start index for results
  const end = page * state.search.resultsPerPage; // End index for results

  return state.search.results.slice(start, end); // Return paginated results
};

/**
 * Update the servings in the recipe and recalculate ingredient quantities.
 * @param {number} newServings - The new number of servings.
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings; // Adjust ingredient quantities
  });

  state.recipe.servings = newServings; // Update servings in the state
};

/**
 * Persist bookmarks to localStorage.
 */
const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks)); // Save bookmarks to local storage
};

const persistShoppingList = function () {
  localStorage.setItem("shoppingList", JSON.stringify(state.shoppingList));
};

/**
 * Add a recipe to bookmarks and persist to localStorage.
 * @param {Object} recipe - The recipe to bookmark.
 */
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe); // Add recipe to the bookmarks array

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true; // Mark current recipe as bookmarked

  persistBookmarks(); // Persist the bookmarks to localStorage
};

/**
 * Remove a recipe from bookmarks and update localStorage.
 * @param {string} id - The ID of the recipe to remove.
 */
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id); // Find bookmark by ID
  state.bookmarks.splice(index, 1); // Remove the bookmark from the array

  if (id === state.recipe.id) state.recipe.bookmarked = false; // Update bookmarked status

  persistBookmarks(); // Update localStorage
};

/**
 * Initialize the bookmarks from localStorage when the application starts.
 */
const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage); // Load bookmarks from localStorage
  const storageShopping = localStorage.getItem("shoppingList");
  if (storageShopping) state.shoppingList = JSON.parse(storageShopping);
};

init(); // Run initialization

/**
 * Clear all bookmarks and update localStorage.
 */
export const clearBookmarks = function () {
  state.bookmarks = []; // Clear bookmarks in the state
  localStorage.removeItem("bookmarks"); // Clear bookmarks from localStorage
};

/**
 * Upload a new recipe to the API and update the state.
 * @param {Object} newRecipe - The new recipe to be uploaded.
 * @throws Will throw an error if ingredient format is invalid.
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = newRecipe.ingredients.map(ing => {
      const { quantity, unit, description } = ing;
      if (!description)
        throw new Error(
          "Wrong ingredient format! Please make sure to provide a description for each ingredient."
        );
      return {
        quantity: quantity ? +quantity : null, // Convert quantity to a number or null
        unit: unit || "", // Default to an empty string if no unit is provided
        description,
      };
    });

    // Create the recipe object to be uploaded
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // Send the recipe data to the API
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data); // Store the newly created recipe
    addBookmark(state.recipe); // Automatically bookmark the newly uploaded recipe
  } catch (err) {
    throw err; // Rethrow error for further handling
  }
};

/**
 * Add all ingredients of the current recipe to the shopping list
 */
export const addToShoppingList = function () {
  const ingredientsWithIds = state.recipe.ingredients.map(ing => {
    return {
      ...ing,
      id: `${Date.now()}-${Math.random()}`,
    };
  });

  state.shoppingList.push(...ingredientsWithIds);
  persistShoppingList();
};

export const deleteShoppingListItem = function (id) {
  const index = state.shoppingList.findIndex(el => el.id === id);
  if (index !== -1) state.shoppingList.splice(index, 1);
  persistShoppingList();
};

/**
 * Get the current shopping list
 */
export const getShoppingList = function () {
  return state.shoppingList;
};
