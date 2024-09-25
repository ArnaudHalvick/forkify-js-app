// shoppingListView.js

import View from "./View.js";
import icons from "url:../../img/icons.svg";

class ShoppingListView extends View {
  _parentElement = document.querySelector(".shopping-list-content");
  _window = document.querySelector(".shopping-list-window");
  _overlay = document.querySelector(".overlay--shopping-list");
  _btnOpen = document.querySelector(".nav__btn--shopping-list");
  _btnClose = document.querySelector(".btn--close-shopping-list");
  _btnClear = document.querySelector(".btn--clear-shopping-list"); // New clear button

  _errorMessage = "Your shopping list is empty.";

  constructor() {
    super();
    this._addHandlerHideWindow();
    this.addHandlerClearShoppingList();
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
   * Add handler for showing the shopping list window and rendering the list
   * @param {Function} handler - Function to call when the modal is opened
   */
  addHandlerShowWindowAndRender(handler) {
    this._btnOpen.addEventListener("click", function () {
      handler();
    });
  }

  /**
   * Add handler for deleting shopping list items
   * @param {Function} handler - Function to call when an item is to be deleted
   */
  addHandlerDeleteItem(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".shopping-list__delete");
      if (!btn) return;

      const item = btn.closest(".shopping-list__item");
      const id = item.dataset.itemId;

      handler(id);
    });
  }

  /**
   * Add handler for clearing the shopping list
   * @param {Function} handler - Function to call when the clear button is clicked
   */
  addHandlerClearShoppingList(handler) {
    this._btnClear.addEventListener("click", handler);
  }

  /**
   * Generate the HTML markup for the shopping list
   */
  _generateMarkup() {
    if (!this._data || this._data.length === 0)
      return '<p class="shopping-list--message">Your shopping list is empty.</p>';
    return this._data.map(ing => this._generateMarkupIngredient(ing)).join("");
  }

  /**
   * Generate markup for a single ingredient in the shopping list
   */
  _generateMarkupIngredient(ing) {
    return `
      <li class="shopping-list__item" data-item-id="${ing.id}">
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
