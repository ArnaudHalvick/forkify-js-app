import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";

import "core-js/stable";
import "regenerator-runtime/runtime.js";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

/**
 * Control the loading and rendering of the recipe details when the page loads or hash changes.
 * Fetches the recipe from the API and updates the UI.
 */
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); // Get the current recipe ID from the URL hash

    if (!id) return; // Exit if no ID is found in the URL
    recipeView.renderSpinner(); // Show loading spinner

    // 0) Update the search results and bookmarks views
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Load the selected recipe
    await model.loadRecipe(id);

    // 2) Render the loaded recipe in the view
    recipeView.render(model.state.recipe);

    // 3) Update the bookmarks in the view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    console.log(err); // Log any errors
    recipeView.renderError(err); // Display error message
  }
};

/**
 * Control search results based on the user's search query.
 * Fetches search results from the API and displays them.
 */
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner(); // Show loading spinner

    // Get the search query from the user input
    const query = searchView.getQuery();
    if (!query) return; // Exit if no query is provided

    // Fetch search results based on the query
    await model.loadSearchResults(query);

    // Render the search results
    resultsView.render(model.getSearchResultsPage());

    // Render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err); // Log any errors
  }
};

/**
 * Handle pagination button clicks and update search results for the corresponding page.
 * @param {number} goToPage - The page number to display.
 */
const controlPagination = function (goToPage) {
  // Render the search results for the selected page
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render the pagination buttons for the current page
  paginationView.render(model.state.search);
};

/**
 * Update the servings in the recipe when the user adjusts the servings count.
 * @param {number} newServings - The new number of servings to update to.
 */
const controlServings = function (newServings) {
  // Update the recipe servings in the state
  model.updateServings(newServings);

  // Update the recipe view with the new servings
  recipeView.update(model.state.recipe);
};

/**
 * Add or remove bookmarks for a recipe.
 */
const controlAddBookmark = function () {
  // Add or remove the bookmark depending on the current bookmark state
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update the recipe view to reflect the new bookmark status
  recipeView.update(model.state.recipe);

  // Render the bookmarks in the bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Render the bookmarks stored in local storage when the page loads.
 */
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks); // Render stored bookmarks
};

/**
 * Clear all bookmarks when the user clicks the clear button.
 */
const controlClearBookmarks = function () {
  // Clear bookmarks in the state
  model.clearBookmarks();

  // Update the current recipe's bookmarked status if it's in the bookmarks list
  if (model.state.recipe) {
    model.state.recipe.bookmarked = false; // Explicitly set bookmarked status to false
  }

  // Update the bookmarks view
  bookmarksView.update(model.state.bookmarks);

  // Update the current recipe view to reflect the unbookmarked status
  recipeView.update(model.state.recipe);
};

/**
 * Handle the addition of a new recipe from the form submission.
 * @param {Object} newRecipe - The recipe data submitted from the form.
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner(); // Show loading spinner

    // Upload the new recipe to the API
    await model.uploadRecipe(newRecipe);

    // Render the newly added recipe
    recipeView.render(model.state.recipe);

    // Display success message
    addRecipeView.renderMessage();

    // Render the updated bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // Change the URL to the new recipe ID without reloading the page
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Close the form window after a brief delay
    setTimeout(() => {
      addRecipeView.closeWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log("💥", err); // Log any errors
    addRecipeView.renderError(err.message); // Display error message
  }
};

/**
 * Initialize the application by setting up all event listeners and handlers.
 */
const init = function () {
  // Render bookmarks when the page loads
  bookmarksView.addHandlerRender(controlBookmarks);

  // Render recipes when the URL hash changes or the page loads
  recipeView.addHandlerRender(controlRecipes);

  // Update servings when the user clicks the servings buttons
  recipeView.addHandlerUpdateServings(controlServings);

  // Add or remove bookmarks when the bookmark button is clicked
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  // Clear all bookmarks when the clear button is clicked
  bookmarksView.addHandlerClearBookmarks(controlClearBookmarks);

  // Trigger search when the user submits a search query
  searchView.addHandlerSearch(controlSearchResults);

  // Handle pagination button clicks
  paginationView.addHandlerClick(controlPagination);

  // Handle recipe form submissions for adding a new recipe
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

// Initialize the application
init();
