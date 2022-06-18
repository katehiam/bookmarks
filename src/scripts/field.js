/**
 * Field handling.
 */
class Field {
  /**
   * Initialise form interactions.
   * @param {HTMLElement} fieldElement DOM element of field
   * @param {HTMLElement} errorElement DOM element of field error
   */
  constructor(fieldElement, errorElement) {
    this.field = fieldElement;
    this.originalValue = this.field.value;
    this.errorElement = errorElement;
    this.errors = [];

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
  };

  /**
   * Validate field.
   * @return {boolean} Whether field is valid or not.
   */
  validate = () => {
    // TODO validation

    return true;
  };
}

export {Field};
