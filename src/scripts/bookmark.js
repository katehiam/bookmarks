/**
 * Bookmark.
 */
class Bookmark {
  /**
   * Initialise form interactions.
   * @param {string} name Custom name for bookmark
   * @param {string} url URL of website to bookmark
   */
  constructor(name, url) {
    this.name = name;
    this.url = url;
    this.identifier = this.generateClassName();
    this.onRemove = () => {};
  }

  /**
   * Generate random classname (avoid conflict between bookmarks with same name)
   * @param {number} length Length of random string to be generated
   * @return {string}
   */
  generateClassName = (length = 10) => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  /**
   * Generate bookmark list item DOM element.
   * @return {HTMLElement}
   */
  generateBookmarkListItem = () => {
    const bookmarkLink = document.createElement('a');
    bookmarkLink.innerHTML = this.name;
    bookmarkLink.href = this.url;
    bookmarkLink.target = '_blank';

    const bookmarkDeleteButton = document.createElement('button');
    bookmarkDeleteButton.innerHTML = 'Delete';
    bookmarkDeleteButton.addEventListener('click', this.handleDeleteClick);

    const bookmarkEditButton = document.createElement('button');
    bookmarkEditButton.innerHTML = 'Edit';
    bookmarkEditButton.addEventListener('click', this.handleEditClick);

    const bookmarkListItem = document.createElement('li');
    bookmarkListItem.classList.add(this.identifier);
    bookmarkListItem.appendChild(bookmarkLink);
    bookmarkListItem.appendChild(bookmarkEditButton);
    bookmarkListItem.appendChild(bookmarkDeleteButton);

    return bookmarkListItem;
  };

  /**
   * Append the bookmark to an element.
   * @param {HTMLElement} element The element that bookmark is appended to
   */
  appendTo = (element) => {
    element.appendChild(this.generateBookmarkListItem());
  };

  /**
   * Handle "delete" button click.
   */
  handleDeleteClick = () => {
    this.remove();
  };

  /**
   * Handle "edit" button click.
   */
  handleEditClick = () => {
    this.showEditPanel();
  };

  /**
   * Show edit form for bookmark.
   */
  showEditPanel = () => {
    // TODO
  };

  /**
   * Remove relative DOM element.
   */
  remove = () => {
    this.onRemove();
    document.querySelector(`.${this.identifier}`).remove();
  };
}

export {Bookmark};
