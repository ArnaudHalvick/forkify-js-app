class SearchView {
  #parentElement = document.querySelector(".search");

  /**
   * Get the search query entered by the user.
   * @returns {string} The search query from the input field.
   */
  getQuery() {
    const query = this.#parentElement.querySelector(".search__field").value; // Retrieve the input value
    this.#clearInput(); // Clear the input field after getting the value
    return query; // Return the search query
  }

  /**
   * Clear the search input field.
   * @private
   */
  #clearInput() {
    this.#parentElement.querySelector(".search__field").value = ""; // Set input field value to empty
  }

  /**
   * Add an event listener for the search form submission.
   * @param {Function} handler The callback function to handle the search event.
   */
  addHandlerSearch(handler) {
    // Add event listener to prevent form submit and trigger the handler function
    this.#parentElement.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent page reload on form submit
      handler(); // Call the handler function when the form is submitted
    });
  }
}

export default new SearchView();
