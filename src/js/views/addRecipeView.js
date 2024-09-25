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
  _formHTML = `
    <div class="upload__column">
      <h3 class="upload__heading">Recipe data</h3>
      <label>Title</label>
      <input value="TEST23" required name="title" type="text" />
      <label>URL</label>
      <input value="TEST23" required name="sourceUrl" type="text" />
      <label>Image URL</label>
      <input value="TEST23" required name="image" type="text" />
      <label>Publisher</label>
      <input value="TEST23" required name="publisher" type="text" />
      <label>Prep time</label>
      <input value="23" required name="cookingTime" type="number" />
      <label>Servings</label>
      <input value="23" required name="servings" type="number" />
    </div>

    <div class="upload__column upload__column--ingredients">
      <h3 class="upload__heading">Ingredients</h3>
      <div class="ingredients-container">
      </div>
      
    </div>
    <div class="upload__btn--container">
      <button class="btn upload__btn">
        <svg>
          <use href="${icons}#icon-upload-cloud"></use>
        </svg>
        <span>Upload</span>
      </button><button type="button" class="btn btn--add-ingredient">
        Add Ingredient
      </button>
    </div>
  `;

  // Define the ingredient input group template
  _ingredientInputGroup = `
    <div class="ingredient-row">
      <label>Ingredient</label>
      <input
        class="ingredient--quantity"
        type="number"
        name="quantity"
        placeholder="Quantity"
        min="0"
        step="0.1"
      />
      <select class="ingredient--select" name="unit">
        <option value="">Unit</option>
        <option value="g">g</option>
        <option value="kg">kg</option>
        <option value="ml">ml</option>
        <option value="l">l</option>
        <option value="tsp">tsp</option>
        <option value="tbsp">tbsp</option>
        <option value="cup">cup</option>
      </select>
      <input
        class="ingredient--description"
        type="text"
        name="description"
        placeholder="Ingredient"
      />
    </div>
  `;

  constructor() {
    super();
    this._addHandlerShowWindow(); // Attach event handler to show modal
    this._addHandlerHideWindow(); // Attach event handler to hide modal
    this._addHandlerCloseErrorModal(); // Attach event handler to close error modal
    // Do NOT call _addHandlerAddIngredient() here
  }

  /**
   * Close the modal window.
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
   * Attach event handler to the "Add Ingredient" button
   */
  _addHandlerAddIngredient() {
    const addIngredientBtn = this._parentElement.querySelector(
      ".btn--add-ingredient"
    );
    if (!addIngredientBtn) return; // Exit if button is not found

    addIngredientBtn.addEventListener(
      "click",
      this._addIngredientField.bind(this)
    );
  }

  /**
   * Add a new ingredient input group to the form
   */
  _addIngredientField() {
    const ingredientsContainer = this._parentElement.querySelector(
      ".ingredients-container"
    );
    const ingredientRow = document.createElement("div");
    ingredientRow.classList.add("ingredient-row");

    // Use the ingredient input group template
    ingredientRow.innerHTML = this._ingredientInputGroup;

    ingredientsContainer.appendChild(ingredientRow);
  }

  /**
   * Restore the original form HTML after submission.
   * Useful for resetting the form when reopening the modal.
   * @private
   */
  _restoreForm() {
    this._parentElement.innerHTML = this._formHTML;
    this._addHandlerAddIngredient(); // Re-attach event listener after form is rendered
    this._addIngredientField(); // Add initial ingredient field
  }

  /**
   * Add an event listener to open the modal when the "Add Recipe" button is clicked.
   * Restores the form content on each open.
   * @private
   */
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", () => {
      this._restoreForm(); // Restore the form content and attach event listeners
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
      e.preventDefault();

      const formData = new FormData(this._parentElement);
      const data = Object.fromEntries(formData);

      // Collect ingredients from all ingredient input groups
      const ingredientRows =
        this._parentElement.querySelectorAll(".ingredient-row");
      const ingredients = [];

      ingredientRows.forEach(row => {
        const quantity = row.querySelector('input[name="quantity"]').value;
        const unit = row.querySelector('select[name="unit"]').value;
        const description = row.querySelector(
          'input[name="description"]'
        ).value;

        // Check if the ingredient fields are not empty
        if (quantity || unit || (description && description.trim() !== "")) {
          ingredients.push({
            quantity: quantity ? +quantity : null,
            unit,
            description: description ? description.trim() : "",
          });
        }
      });

      // Validate and proceed with the rest of your code
      if (ingredients.length === 0) {
        this.showErrorModal("You must add at least one ingredient.");
        return;
      }

      console.log(ingredients);
      if (!this._validateIngredients(ingredients)) return;

      const recipeData = {
        title: data.title,
        sourceUrl: data.sourceUrl,
        image: data.image,
        publisher: data.publisher,
        cookingTime: +data.cookingTime,
        servings: +data.servings,
        ingredients,
      };

      handler(recipeData);
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
