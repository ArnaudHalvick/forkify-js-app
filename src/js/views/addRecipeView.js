import icons from "url:../../img/icons.svg";
import View from "./View.js";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _successMessage = "Recipe was successfully uploaded 😃";

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");
  _errorModal = document.querySelector(".error-modal");
  _errorModalCloseBtn = document.querySelector(".error-modal__close-btn");
  _errorModalOverlay = document.querySelector(".error-modal--overlay");

  // Store the initial form HTML to restore later (after success message)
  _formHTML = this._parentElement.innerHTML;

  constructor() {
    super();
    this._addHandlerShowWindow(); // Attach event handler to show modal
    this._addHandlerHideWindow(); // Attach event handler to hide modal
    this._addHandlerCloseErrorModal(); // Attach event handler to close error modal
  }

  /**
   * Close the modal window. Can't use toggle when uploading the recipe, because if the user closes it before timeout, it will reopen
   */
  closeWindow() {
    this._overlay.classList.add("hidden");
    this._window.classList.add("hidden");
  }

  /**
   * Toggle the visibility of the modal window and overlay.
   */
  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  /**
   * Toggle error modal visibility
   * @param {string} message The error message to display in the modal.
   */
  showErrorModal(message) {
    this._errorModal.querySelector(".error-modal__message").textContent =
      message;
    this._errorModal.classList.toggle("hidden");
    this._errorModalOverlay.classList.toggle("hidden");
  }

  /**
   * Close the error modal
   */
  closeErrorModal() {
    this._errorModal.classList.add("hidden");
    this._errorModalOverlay.classList.toggle("hidden");
  }

  /**
   * Attach event handler to close the error modal
   */
  _addHandlerCloseErrorModal() {
    // Close the error modal when the close button is clicked
    this._errorModalCloseBtn.addEventListener(
      "click",
      this.closeErrorModal.bind(this)
    );

    // Close the error modal when the overlay is clicked
    this._errorModalOverlay.addEventListener(
      "click",
      this.closeErrorModal.bind(this)
    );
  }

  /**
   * Restore the original form HTML after submission.
   * Useful for resetting the form when reopening the modal.
   * @private
   */
  _restoreForm() {
    this._parentElement.innerHTML = this._formHTML;
  }

  /**
   * Add an event listener to open the modal when the "Add Recipe" button is clicked.
   * Restores the form content on each open.
   * @private
   */
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", () => {
      this._restoreForm(); // Restore the form content
      this.toggleWindow(); // Open the modal
    });
  }

  /**
   * Add event listeners to close the modal window (using close button or overlay click).
   * @private
   */
  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this)); // Close modal on button click
    this._overlay.addEventListener("click", this.toggleWindow.bind(this)); // Close modal when clicking outside the form
  }

  /**
   * Validate ingredients before form submission.
   * @param {Array} ingredients The ingredients array from the form
   * @returns {boolean} True if all ingredients are valid, false otherwise
   */

  _validateIngredients(ingredients) {
    for (let i = 0; i < ingredients.length; i++) {
      const { quantity, unit, description } = ingredients[i];

      // If unit is selected but quantity is zero or less
      if (unit && (!quantity || quantity <= 0)) {
        this.showErrorModal(
          `Ingredient ${
            i + 1
          }: Quantity must be greater than 0 when a unit is selected.`
        );
        return false;
      }

      // If quantity is greater than 0 but description is missing or empty
      if (quantity > 0 && (!description || description.trim() === "")) {
        this.showErrorModal(
          `Ingredient ${
            i + 1
          }: Description is required when quantity is specified.`
        );
        return false;
      }

      // Check if both unit and description are missing but quantity exists (invalid)
      if (!description && quantity > 0) {
        this.showErrorModal(
          `Ingredient ${
            i + 1
          }: You can't specify a quantity without a description.`
        );
        return false;
      }
    }

    return true; // If all ingredients are valid
  }

  /**
   * Add an event listener to handle form submission and upload recipe data.
   * This will gather the form data and pass it to the provided handler function.
   * @param {Function} handler The callback function to handle the form data.
   */
  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", e => {
      e.preventDefault(); // Prevent default form submission behavior

      const formData = new FormData(this._parentElement); // Create a FormData object from the form element
      const data = Object.fromEntries(formData); // Convert the FormData object into a plain object

      // Gather ingredients from the form (up to 6 ingredients)
      const ingredients = [];
      for (let i = 1; i <= 6; i++) {
        const quantity = data[`quantity-${i}`];
        const unit = data[`unit-${i}`];
        const description = data[`ingredient-${i}`];

        // Filter out ingredients that are completely empty (no quantity, unit, or description)
        if (quantity || unit || (description && description.trim() !== "")) {
          ingredients.push({
            quantity: quantity ? +quantity : null, // Convert to number or null if no value
            unit,
            description: description ? description.trim() : "", // Trim whitespace from the description
          });
        }
      }

      // Check if all ingredients are empty
      if (ingredients.length === 0) {
        this.showErrorModal("You must add at least one ingredient.");
        return; // Prevent form submission
      }

      // Validate ingredients before proceeding
      if (!this._validateIngredients(ingredients)) return;

      // Create the full recipe object
      const recipeData = {
        title: data.title,
        sourceUrl: data.sourceUrl,
        image: data.image,
        publisher: data.publisher,
        cookingTime: +data.cookingTime,
        servings: +data.servings,
        ingredients, // Only non-empty ingredients will be passed
      };

      handler(recipeData); // Pass recipe data to the handler
    });
  }

  /**
   * Render a success message after recipe upload.
   * @param {string} [message=this._successMessage] The success message to display.
   */
  renderMessage(message = this._successMessage) {
    const markup = `<div class="message">
                      <div>
                        <svg>
                          <use href="${icons}#icon-smile"></use>
                        </svg>
                      </div>
                      <p>${message}</p>
                    </div>`;
    this._parentElement.innerHTML = markup; // Replace form with success message
  }
}

export default new AddRecipeView();
