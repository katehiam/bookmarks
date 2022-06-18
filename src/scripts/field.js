/**
 * Field handling.
 */
class Field {
  /**
   * Initialise form interactions.
   * @param {HTMLElement} wrapperElement DOM element of field wrapper
   * @param {HTMLElement} inputElement DOM element of field input
   * @param {HTMLElement} errorElement DOM element of field error
   */
  constructor(wrapperElement, inputElement, errorElement = null) {
    this.field = wrapperElement;
    this.inputField = inputElement;
    this.originalValue = this.inputField.value;
    this.errorElement = errorElement;
    this.errors = [];
    this.validationChecks = [];
    const {validationRequired, validationUrl} = this.inputField.dataset;
    if (validationRequired !== undefined) {
      this.validationChecks.push('required');
    }
    if (validationUrl !== undefined) {
      this.validationChecks.push('url');
    }

    this.inputField.addEventListener('focus', this.handleFieldFocus);
    this.inputField.addEventListener('blur', this.handleFieldBlur);
  }

  /**
   * Handle field focus.
   */
  handleFieldFocus = () => {
    this.clearErrors();
  };

  /**
   * Handle field blur.
   */
  handleFieldBlur = () => {
    this.validate();
  };

  /**
   * Reset errors and value of field.
   */
  reset = () => {
    this.inputField.value = this.originalValue;
    this.clearErrors();
  };

  /**
   * Clear errors on field.
   */
  clearErrors = () => {
    this.errors = [];
    if (this.errorElement) this.errorElement.innerHTML = '';
    this.field.classList.remove('form__field--has-error');
  };

  /**
   * Check if value exists.
   * @return {boolean} Whether field is valid or not.
   */
  checkExists = () => {
    return !!this.inputField.value || this.inputField.value !== '';
  };

  /**
   * Check if value is URL.
   * @return {boolean} Whether field is valid or not.
   */
  checkIsUrl = () => {
    try {
      new URL(this.inputField.value);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Validate field.
   * @return {boolean} Whether field is valid or not.
   */
  validate = () => {
    this.clearErrors();
    let valid = true;

    for (const validationCheck of this.validationChecks) {
      switch (validationCheck) {
        case 'required':
          if (!this.checkExists()) {
            valid = false;
            this.errors.push({message: 'This field is required.'});
          }
          break;
        case 'url':
          if (!this.checkIsUrl()) {
            valid = false;
            this.errors.push({message: 'This field must be a valid URL.'});
          }
          break;
      }
    }

    for (const error of this.errors) {
      const newErrorMessage = document.createElement('p');
      newErrorMessage.innerHTML = error.message;
      if (this.errorElement) this.errorElement.appendChild(newErrorMessage);
    }

    if (!valid) {
      this.field.classList.add('form__field--has-error');
    }

    return valid;
  };

  /**
   * Clean up.
   */
  destroy = () => {
    this.inputField.removeEventListener('focus', this.handleFieldFocus);
    this.inputField.removeEventListener('blur', this.handleFieldBlur);
  };
}

export {Field};
