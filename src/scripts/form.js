import {Field} from '@scripts/field';

/**
 * Form handling.
 */
class Form {
  /**
   * Initialise form interactions.
   * @param {HTMLElement} formElement DOM element of form
   * @param {HTMLElement} errorsElement DOM element of errors
   */
  constructor(formElement, errorsElement = null) {
    this.form = formElement;
    this.form.addEventListener('submit', this.handleSubmit);
    this.formErrors = errorsElement || formElement.querySelector('.errors');
    const domFields = Array.from(this.form.querySelectorAll('input, textarea'));
    this.fields = [];
    this.onSuccess = () => {};

    for (const field of domFields) {
      this.fields.push(new Field(field));
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
    // TODO validation
    let valid = true;
    for (const field of this.fields) {
      if (!field.validate) valid = false;
    }

    return valid;
  };
}

export {Form};
