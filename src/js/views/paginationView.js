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
  // In paginationView.js
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const totalPagesMarkup = `<span class="pagination__info">Page ${curPage}/${numPages}</span>`;

    // First page with more than one page
    if (curPage === 1 && numPages > 1) {
      return `${totalPagesMarkup} ${this._generateNextPageBtn(curPage)}`;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return `${this._generatePrevPageBtn(curPage)} ${totalPagesMarkup}`;
    }

    // Other pages
    if (curPage < numPages) {
      return `${this._generatePrevPageBtn(
        curPage
      )} ${totalPagesMarkup} ${this._generateNextPageBtn(curPage)}`;
    }

    // Only one page (no buttons needed)
    return totalPagesMarkup;
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
