import icons from "url:../../img/icons.svg";
import View from "./View.js";
import fracty from "fracty";

class RecipeView extends View {
  _parentElement = document.querySelector(".recipe"); // Parent element for rendering the recipe
  _errorMessage = "We could not find that recipe. Please try another one!";
  _successMessage = "";

  /**
   * Add event listeners to handle rendering when hash changes (e.g., recipe selection) or page load.
   * @param {Function} handler - The function to call when the event triggers.
   */
  addHandlerRender(handler) {
    ["hashchange", "load"].forEach(ev => window.addEventListener(ev, handler));
  }

  /**
   * Add event listener to update servings when the user clicks on the increase/decrease buttons.
   * @param {Function} handler - The function to call with the new servings count.
   */
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--update-servings");

      if (!btn) return;

      const updateTo = +btn.dataset.updateTo; // Get the new servings value

      if (updateTo > 0) handler(updateTo); // Only update if servings is positive
    });
  }

  /**
   * Add event listener to handle adding/removing bookmarks.
   * @param {Function} handler - The function to call when the bookmark button is clicked.
   */
  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--bookmark");
      if (!btn) return;
      handler();
    });
  }

  /**
   * Generate the HTML markup for the entire recipe.
   * @returns {string} - The generated HTML string for the recipe.
   * @private
   */
  _generateMarkup() {
    return `<figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>
  
    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>
  
        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings - 1
          }">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings + 1
          }">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>
  
      <div class="recipe__user-generated ${this._data.key ? "" : "hidden"}">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? "-fill" : ""
    }"></use>
        </svg>
      </button>
    </div>
  
    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${this._data.ingredients.map(this._generateMarkupIngredient).join("")}
      </ul>
    </div>
  
    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      ${
        this._data.description
          ? `<p class="recipe__description">${this._data.description}</p>`
          : ""
      }
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out directions at their website.
      </p>
      <a class="btn--small recipe__btn" href="${
        this._data.sourceUrl
      }" target="_blank">
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>`;
  }

  /**
   * Generate the HTML markup for each ingredient in the recipe.
   * @param {Object} ing - Ingredient object containing quantity, unit, and description.
   * @returns {string} - HTML string for an individual ingredient.
   * @private
   */
  _generateMarkupIngredient(ing) {
    return `<li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${
        ing.quantity ? fracty(ing.quantity).toString() : ""
      }</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>`;
  }
}

export default new RecipeView();
