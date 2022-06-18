/**
 * Pagination link handling.
 */
class PaginationLink {
  /**
   * Initialise pagination link instance.
   * @param {string} href Href attribute value for link
   * @param {string} label Label (aria label and inner HTML) of link
   * @param {boolean} disabled Whether the link is disabled
   * @param {[string]} classes Array of classes to be applied to link
   * @param {string} displayLabel Label (inner HTML) of link - overrides label
   */
  constructor(
    href,
    label,
    disabled,
    classes = ['pagination__link'],
    displayLabel,
  ) {
    this.linkElement = null;
    this.href = href;
    this.label = label;
    this.disabled = disabled;
    this.classes = classes;
    this.displayLabel = displayLabel || this.label;
    this.onClick = () => {};
  }

  /**
   * Handle link click.
   * @param {Event} e Native submit event
   */
  handleClick = (e) => {
    this.onClick(e);
  };

  /**
   * Generate pagination link DOM element.
   * @return {HTMLElement}
   */
  generatePaginationLink = () => {
    const link = document.createElement('a');
    link.innerHTML = this.displayLabel;
    link.ariaLabel = this.label;
    link.role = 'link';
    if (this.disabled) {
      this.ariaDisabled = 'true';
    } else {
      link.href = this.href;
    }
    for (const className of this.classes) {
      link.classList.add(className);
    }
    return link;
  };

  /**
   * Append the pagination link to an element.
   * @param {HTMLElement} element The element that link is appended to
   */
  appendTo = (element) => {
    this.linkElement = this.generatePaginationLink();
    element.appendChild(this.linkElement);
  };

  /**
   * Clean up.
   */
  remove = () => {
    this.destroy();
    this.linkElement.remove();
  };

  /**
   * Clean up.
   */
  destroy = () => {
    this.linkElement.removeEventListener('click', this.handleClick);
  };
}

export {PaginationLink};
