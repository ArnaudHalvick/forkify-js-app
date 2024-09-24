import View from "./View.js";
import previewView from "./previewView.js";

class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list"); // Parent element where bookmarks will be rendered
  _clearButton = document.querySelector(".btn--clear-bookmarks"); // Select the clear bookmarks button
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it!";
  _successMessage = "";

  /**
   * Add an event listener to render bookmarks when the page loads.
   * @param {Function} handler Function to handle bookmark rendering.
   */
  addHandlerRender(handler) {
    window.addEventListener("load", handler); // Render bookmarks on window load
  }

  /**
   * Add an event listener to handle clearing all bookmarks.
   * @param {Function} handler Function to handle clearing bookmarks.
   */
  addHandlerClearBookmarks(handler) {
    if (this._clearButton) {
      this._clearButton.addEventListener("click", handler); // Call handler when clear button is clicked
    }
  }

  /**
   * Generate the markup for each bookmark by using the previewView component.
   * @returns {string} HTML markup string for the bookmarks.
   * @private
   */
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false)) // Generate markup for each bookmark
      .join(""); // Join the markup strings into a single string
  }
}

export default new BookmarksView();
