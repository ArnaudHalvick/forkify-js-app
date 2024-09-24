import icons from "url:../../img/icons.svg";
import View from "./View.js";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _successMessage = "Recipe was successfully uploaded 😃";

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  // Store the initial form HTML to restore later (after success message)
  _formHTML = this._parentElement.innerHTML;

  constructor() {
    super();
    this._addHandlerShowWindow(); // Attach event handler to show modal
    this._addHandlerHideWindow(); // Attach event handler to hide modal
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
   * Add an event listener to handle form submission and upload recipe data.
   * This will gather the form data and pass it to the provided handler function.
   * @param {Function} handler The callback function to handle the form data.
   */
  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent default form submission behavior

      const formData = new FormData(this); // Create a FormData object to retrieve form values
      const data = Object.fromEntries(formData); // Convert the FormData object into a plain object

      // Gather ingredients from the form (up to 6 ingredients)
      const ingredients = [];
      for (let i = 1; i <= 6; i++) {
        const quantity = data[`quantity-${i}`];
        const unit = data[`unit-${i}`];
        const description = data[`ingredient-${i}`];

        // Only include ingredients with a description
        if (description) {
          ingredients.push({
            quantity: quantity ? +quantity : null, // Convert to number or null if no value
            unit,
            description,
          });
        }
      }

      // Create the full recipe object with description and ingredients
      const recipeData = {
        ...data,
        ingredients,
        description: data.description, // Include the description from the form
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
