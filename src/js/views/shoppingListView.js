// shoppingListView.js

import View from "./View.js";
import icons from "url:../../img/icons.svg";

class ShoppingListView extends View {
  _parentElement = document.querySelector(".shopping-list-content");
  _window = document.querySelector(".shopping-list-window");
  _overlay = document.querySelector(".overlay--shopping-list");
  _btnOpen = document.querySelector(".nav__btn--shopping-list");
  _btnClose = document.querySelector(".btn--close-shopping-list");

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  // Method to open the modal
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  // Method to close the modal
  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  // Toggle modal visibility
  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  openWindow() {
    this._overlay.classList.remove("hidden");
    this._window.classList.remove("hidden");
  }

  /**
   * Generate the HTML markup for the shopping list
   */
  _generateMarkup() {
    return this._data.map(ing => this._generateMarkupIngredient(ing)).join("");
  }

  /**
   * Generate markup for a single ingredient in the shopping list
   */
  _generateMarkupIngredient(ing) {
    return `
      <li class="shopping-list__item">
        <div class="shopping-list__quantity">
          ${ing.quantity ? ing.quantity : ""}
        </div>
        <div class="shopping-list__description">
          ${ing.description}
          ${
            ing.unit
              ? `<span class="shopping-list__unit">${ing.unit}</span>`
              : ""
          }
        </div>
        <button class="shopping-list__delete">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
      </li>
    `;
  }
}

export default new ShoppingListView();
