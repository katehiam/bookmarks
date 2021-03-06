import {Field} from '@scripts/field';

/**
 * Form handling.
 */
class Form {
  /**
   * Initialise form interactions.
   * @param {HTMLElement} formElement DOM element of form
   */
  constructor(formElement) {
    this.form = formElement;
    this.form.addEventListener('submit', this.handleSubmit);
    const domFields = Array.from(this.form.querySelectorAll('.form__field'));
    this.fields = [];
    this.onSuccess = () => {};

    for (const field of domFields) {
      const inputElement = field.querySelector('.form__field__input');
      const errorElement = field.querySelector('.form__field__error');
      this.fields.push(new Field(field, inputElement, errorElement));
    }
  }

  /**
   * Handle form submission.
   * @param {Event} e Native submit event
   */
  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.validate()) return;

    const formData = new FormData(this.form);
    this.onSuccess(formData);
  };

  /**
   * Reset errors and value of field.
   */
  reset = () => {
    for (const field of this.fields) {
      field.reset();
    }
  };

  /**
   * Validate all form fields.
   * @return {boolean}
   */
  validate = () => {
    let valid = true;
    for (const field of this.fields) {
      if (!field.validate()) valid = false;
    }

    return valid;
  };

  /**
   * Clean up.
   */
  destroy = () => {
    this.form.removeEventListener('submit', this.handleSubmit);

    for (const field of this.fields) {
      field.inputElement.removeEventListener('focus', this.handleFieldFocus);
      field.inputElement.removeEventListener('blur', this.handleFieldBlur);
    }
  };
}

export {Form};
