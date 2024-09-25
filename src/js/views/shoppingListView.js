// shoppingListView.js

import View from "./View.js";

class ShoppingListView extends View {
  _parentElement = document.querySelector(".shopping-list-content");
  _window = document.querySelector(".shopping-list-window");
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
  }

  // Toggle modal visibility
  toggleWindow() {
    this._window.classList.toggle("hidden");
  }

  openWindow() {
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
        <span>${ing.quantity ? ing.quantity : ""} ${ing.unit} ${
      ing.description
    }</span>
      </li>
    `;
  }
}

export default new ShoppingListView();
