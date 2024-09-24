import icons from "url:../../img/icons.svg";
import View from "./View.js";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination"); // Pagination container element

  /**
   * Add event listener to handle clicks on pagination buttons.
   * @param {Function} handler Function to handle the page change on button click.
   */
  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline"); // Find the closest pagination button

      if (!btn) return; // Exit if no button was clicked

      const goToPage = +btn.dataset.goto; // Get the page number to go to from data attribute

      handler(goToPage); // Call the handler with the selected page number
    });
  }

  /**
   * Generate pagination buttons based on the current page and total pages.
   * @returns {string} HTML markup for the pagination buttons.
   * @private
   */
  _generateMarkup() {
    const curPage = this._data.page; // Current page number
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    ); // Total number of pages

    // If only 1 page exists, don't show any pagination
    if (numPages === 1) return "";

    // If on the first page, show only the "Next" button
    if (curPage === 1) return this._generateNextPageBtn(curPage);

    // If on the last page, show only the "Previous" button
    if (curPage === numPages) return this._generatePrevPageBtn(curPage);

    // If on a middle page, show both "Previous" and "Next" buttons
    return `${this._generatePrevPageBtn(curPage)} ${this._generateNextPageBtn(
      curPage
    )}`;
  }

  /**
   * Generate the "Previous Page" button HTML.
   * @param {number} curPage Current page number.
   * @returns {string} HTML markup for the previous page button.
   * @private
   */
  _generatePrevPageBtn(curPage) {
    return `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
    `;
  }

  /**
   * Generate the "Next Page" button HTML.
   * @param {number} curPage Current page number.
   * @returns {string} HTML markup for the next page button.
   * @private
   */
  _generateNextPageBtn(curPage) {
    return `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
  }
}

export default new PaginationView();
