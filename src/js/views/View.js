import icons from "url:../../img/icons.svg";

export default class View {
  _data; // Property to store the data to be rendered

  /**
   * Render the data in the UI or return it as a markup string.
   * @param {Object | Object[]} data The data to be rendered (can be an object or array of objects)
   * @param {boolean} [render = true] If false, returns markup string instead of rendering it to the DOM
   * @returns {undefined | string} Markup string if render is false
   */
  render(data, render = true) {
    // If data is undefined or null, display an error message
    if (data === undefined || data === null) return this.renderError();

    // Store the data in the instance for further use
    this._data = data;

    // Generate the markup for the data
    const markup = this._generateMarkup();

    // If render is false, return the markup string (do not render)
    if (!render) return markup;

    // Otherwise, clear the parent element and insert the generated markup into the DOM
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Update only text and attributes in the DOM instead of re-rendering the entire view.
   * @param {Object | Object[]} data The updated data to render
   */
  update(data) {
    // If no data or empty array, show error
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    // Generate the new markup based on the updated data
    const newMarkup = this._generateMarkup();

    // Create a DOM fragment from the new markup
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // Get all elements from the new DOM and current DOM
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    // Compare new elements to current elements and update only what has changed
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Ensure curEl exists before comparing
      if (!curEl) return;

      // If the element content is different, update the text content
      if (!newEl.isEqualNode(curEl)) {
        const newText =
          newEl.firstChild?.nodeValue && newEl.firstChild.nodeValue.trim();

        // Only update text if it's different
        if (newText && curEl.textContent.trim() !== newText) {
          curEl.textContent = newText;
        }

        // Update attributes if they are different
        Array.from(newEl.attributes).forEach(attr => {
          if (curEl.getAttribute(attr.name) !== attr.value) {
            curEl.setAttribute(attr.name, attr.value);
          }
        });
      }
    });
  }

  /**
   * Clear the content of the parent element.
   */
  _clear() {
    this._parentElement.innerHTML = ""; // Empty the parent element
  }

  /**
   * Render a loading spinner while waiting for data to load.
   */
  renderSpinner() {
    const markup = `<div class="spinner">
                      <svg>
                        <use href="${icons}#icon-loader"></use>
                      </svg>
                    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup); // Insert the spinner markup
  }

  /**
   * Render an error message in the UI.
   * @param {string} [message=this._errorMessage] Custom error message
   */
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
                      <div>
                        <svg>
                          <use href="${icons}#icon-alert-triangle"></use>
                        </svg>
                      </div>
                      <p>${message}</p>
                    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup); // Insert the error message markup
  }

  /**
   * Render a success message in the UI.
   * @param {string} [message=this._successMessage] Custom success message
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
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup); // Insert the success message markup
  }
}
