import {Form} from './form';

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
    this.bookmarkElement = null;
    this.name = name;
    this.url = url;
    this.identifier = this.generateUniqueIdentifier();
    this.editForm = null;
    this.onRemove = () => {};
  }

  /**
   * Generate random classname (avoid conflict between bookmarks with same name)
   * @param {number} length Length of random string to be generated
   * @return {string}
   */
  generateUniqueIdentifier = (length = 10) => {
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
    bookmarkLink.classList.add('bookmark-link');
    bookmarkLink.innerHTML = this.name;
    bookmarkLink.href = this.url;
    bookmarkLink.target = '_blank';

    const bookmarkDeleteButton = document.createElement('button');
    bookmarkDeleteButton.innerHTML = 'Delete';
    bookmarkDeleteButton.addEventListener('click', this.handleDeleteClick);

    const bookmarkEditButton = document.createElement('button');
    bookmarkEditButton.innerHTML = 'Edit';
    bookmarkEditButton.addEventListener('click', this.handleEditClick);

    const bookmarkEditFormLegend = document.createElement('legend');
    bookmarkEditFormLegend.innerHTML = 'Edit bookmark';

    const bookmarkEditNameField = document.createElement('input');
    bookmarkEditNameField.type = 'text';
    bookmarkEditNameField.id = `${this.identifier}-name`;
    bookmarkEditNameField.name = 'name';
    bookmarkEditNameField.value = this.name;

    const bookmarkEditNameLabel = document.createElement('label');
    bookmarkEditNameLabel.for = `${this.identifier}-name`;
    bookmarkEditNameLabel.innerHTML = 'Name: ';
    bookmarkEditNameLabel.appendChild(bookmarkEditNameField);

    const bookmarkEditUrlField = document.createElement('input');
    bookmarkEditUrlField.type = 'text';
    bookmarkEditUrlField.id = `${this.identifier}-url`;
    bookmarkEditUrlField.name = 'url';
    bookmarkEditUrlField.value = this.url;

    const bookmarkEditUrlLabel = document.createElement('label');
    bookmarkEditUrlLabel.for = `${this.identifier}-url`;
    bookmarkEditUrlLabel.innerHTML = 'Url: ';
    bookmarkEditUrlLabel.appendChild(bookmarkEditUrlField);

    const bookmarkEditSubmitButton = document.createElement('button');
    bookmarkEditSubmitButton.innerHTML = 'Update';

    const bookmarkEditCancelButton = document.createElement('button');
    bookmarkEditCancelButton.type = 'button';
    bookmarkEditCancelButton.innerHTML = 'Cancel';
    bookmarkEditCancelButton.addEventListener('click', this.handleEditCancel);

    const bookmarkEditFormFieldset = document.createElement('fieldset');
    bookmarkEditFormFieldset.appendChild(bookmarkEditFormLegend);
    bookmarkEditFormFieldset.appendChild(bookmarkEditNameLabel);
    bookmarkEditFormFieldset.appendChild(bookmarkEditUrlLabel);
    bookmarkEditFormFieldset.appendChild(bookmarkEditSubmitButton);
    bookmarkEditFormFieldset.appendChild(bookmarkEditCancelButton);

    const bookmarkEditForm = document.createElement('form');
    bookmarkEditForm.appendChild(bookmarkEditFormFieldset);
    bookmarkEditForm.style.height = '0';

    const bookmarkListItem = document.createElement('li');
    bookmarkListItem.classList.add(this.identifier);
    bookmarkListItem.appendChild(bookmarkLink);
    bookmarkListItem.appendChild(bookmarkEditButton);
    bookmarkListItem.appendChild(bookmarkDeleteButton);
    bookmarkListItem.appendChild(bookmarkEditForm);

    this.initialiseEditForm(bookmarkEditForm);

    return bookmarkListItem;
  };

  /**
   * Append the bookmark to an element.
   * @param {HTMLElement} element The element that bookmark is appended to
   */
  appendTo = (element) => {
    this.bookmarkElement = this.generateBookmarkListItem();
    element.appendChild(this.bookmarkElement);
  };

  /**
   * Initialise edit form interactions.
   * @param {HTMLElement} element The form element
   */
  initialiseEditForm = (element) => {
    this.editForm = new Form(element);
    this.editForm.onSuccess = (data) => {
      this.name = data.get('name');
      this.url = data.get('url');

      // Update DOM element to reflect changes
      const link = this.bookmarkElement.querySelector('.bookmark-link');
      link.innerHTML = this.name;
      link.href = this.url;
    };
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
   * Handle edit form submission.
   * @param {Event} e Native submit event
   */
  handleEditSubmit = (e) => {
    e.preventDefault();
    // TODO
  };

  /**
   * Handle cancel click on edit form.
   */
  handleEditCancel = () => {
    this.hideEditPanel();
  };

  /**
   * Show edit form for bookmark.
   */
  showEditPanel = () => {
    const fullHeight =
      this.bookmarkElement.querySelector('fieldset').scrollHeight;
    this.bookmarkElement.querySelector('form').style.height = `${fullHeight}px`;
  };

  /**
   * Hide edit form for bookmark.
   */
  hideEditPanel = () => {
    this.bookmarkElement.querySelector('form').style.height = '0';
  };

  /**
   * Remove relative DOM element.
   */
  remove = () => {
    this.onRemove();
    this.bookmarkElement.remove();
  };
}

export {Bookmark};
