/**
 * Field handling.
 */
class Field {
  /**
   * Initialise form interactions.
   * @param {HTMLElement} fieldElement DOM element of field
   * @param {HTMLElement} errorElement DOM element of field error
   */
  constructor(fieldElement, errorElement = null) {
    this.field = fieldElement;
    this.originalValue = this.field.value;
    this.errorElement = errorElement;
    this.errors = [];
    this.validationChecks = [];
    const {validationRequired, validationUrl} = this.field.dataset;
    if (validationRequired !== undefined) {
      this.validationChecks.push('required');
    }
    if (validationUrl !== undefined) {
      this.validationChecks.push('url');
    }

    this.field.addEventListener('focus', this.handleFieldFocus);
    this.field.addEventListener('blur', this.handleFieldBlur);
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
    this.field.value = this.originalValue;
    this.clearErrors();
  };

  /**
   * Clear errors on field.
   */
  clearErrors = () => {
    this.errors = [];
    if (this.errorElement) this.errorElement.innerHTML = '';
  };

  /**
   * Check if value exists.
   * @return {boolean} Whether field is valid or not.
   */
  checkExists = () => {
    return !!this.field.value || this.field.value !== '';
  };

  /**
   * Check if value is URL.
   * @return {boolean} Whether field is valid or not.
   */
  checkIsUrl = () => {
    try {
      new URL(this.field.value);
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

    return valid;
  };
}

export {Field};
