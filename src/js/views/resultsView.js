import View from "./View.js";
import previewView from "./previewView.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".results"); // Container for displaying search results
  _errorMessage = "No recipe found for your query. Please try again !"; // Message to display if no results found
  _successMessage = ""; // Placeholder for any success message

  /**
   * Generate HTML markup for the search results.
   * It maps over the data, uses the `previewView` to render each result, and joins them into a single string.
   * @returns {string} HTML markup string for the search results.
   * @private
   */
  _generateMarkup() {
    return this._data
      .map(result => previewView.render(result, false)) // Render each result using `previewView` without updating DOM
      .join(""); // Join the resulting HTML strings
  }
}

export default new ResultsView();
