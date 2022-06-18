/**
 * Pagination link handling.
 */
class PaginationLink {
  /**
   * Initialise pagination link instance.
   * @param {string} href Href attribute value for link
   * @param {string} label Label (inner HTML) of link
   * @param {[string]} classes Array of classes to be applied to link
   */
  constructor(href, label, classes = []) {
    this.linkElement = null;
    this.href = href;
    this.label = label;
    this.classes = classes;
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
    link.innerHTML = this.label;
    link.href = this.href;
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
