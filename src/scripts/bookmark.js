import {Form} from './form';

/**
 * Bookmark.
 */
class Bookmark {
  /**
   * Initialise bookmark instance.
   * @param {string} name Custom name for bookmark
   * @param {string} url URL of website to bookmark
   */
  constructor(name, url) {
    this.bookmarkElement = null;
    this.name = name;
    this.url = url;
    this.identifier = this.generateUniqueIdentifier();
    this.editForm = null;
    this.onUpdate = () => {};
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
    bookmarkLink.classList.add('bookmarks__bookmark__link');
    bookmarkLink.innerHTML = this.name;
    bookmarkLink.href = this.url;
    bookmarkLink.target = '_blank';

    const bookmarkDeleteButton = document.createElement('button');
    bookmarkDeleteButton.classList.add('bookmarks__bookmark__button');
    bookmarkDeleteButton.classList.add('bookmarks__bookmark__button--delete');
    bookmarkDeleteButton.innerHTML = 'Delete';
    bookmarkDeleteButton.addEventListener('click', this.handleDeleteClick);

    const bookmarkEditButton = document.createElement('button');
    bookmarkEditButton.classList.add('bookmarks__bookmark__button');
    bookmarkEditButton.classList.add('bookmarks__bookmark__button--edit');
    bookmarkEditButton.innerHTML = 'Edit';
    bookmarkEditButton.addEventListener('click', this.handleEditClick);

    const bookmarkEditFormLegend = document.createElement('legend');
    bookmarkEditFormLegend.classList.add('form__legend');
    bookmarkEditFormLegend.innerHTML = 'Edit bookmark';

    const bookmarkEditNameField = document.createElement('input');
    bookmarkEditNameField.classList.add('form__field__input');
    bookmarkEditNameField.type = 'text';
    bookmarkEditNameField.id = `${this.identifier}-name`;
    bookmarkEditNameField.name = 'name';
    bookmarkEditNameField.value = this.name;
    bookmarkEditNameField.dataset.validationRequired = true;

    const bookmarkEditNameLabel = document.createElement('label');
    bookmarkEditNameLabel.classList.add('form__field__label');
    bookmarkEditNameLabel.for = `${this.identifier}-name`;
    bookmarkEditNameLabel.innerHTML = 'NAME';
    bookmarkEditNameLabel.appendChild(bookmarkEditNameField);

    const bookmarkEditNameError = document.createElement('div');
    bookmarkEditNameError.classList.add('form__field__error');

    const bookmarkEditNameWrapper = document.createElement('div');
    bookmarkEditNameWrapper.classList.add('form__field');
    bookmarkEditNameWrapper.appendChild(bookmarkEditNameLabel);
    bookmarkEditNameWrapper.appendChild(bookmarkEditNameError);

    const bookmarkEditUrlField = document.createElement('input');
    bookmarkEditUrlField.classList.add('form__field__input');
    bookmarkEditUrlField.type = 'text';
    bookmarkEditUrlField.id = `${this.identifier}-url`;
    bookmarkEditUrlField.name = 'url';
    bookmarkEditUrlField.value = this.url;
    bookmarkEditUrlField.dataset.validationRequired = true;
    bookmarkEditUrlField.dataset.validationUrl = true;

    const bookmarkEditUrlLabel = document.createElement('label');
    bookmarkEditUrlLabel.classList.add('form__field__label');
    bookmarkEditUrlLabel.for = `${this.identifier}-url`;
    bookmarkEditUrlLabel.innerHTML = 'URL';
    bookmarkEditUrlLabel.appendChild(bookmarkEditUrlField);

    const bookmarkEditUrlError = document.createElement('div');
    bookmarkEditUrlError.classList.add('form__field__error');

    const bookmarkEditUrlWrapper = document.createElement('div');
    bookmarkEditUrlWrapper.classList.add('form__field');
    bookmarkEditUrlWrapper.appendChild(bookmarkEditUrlLabel);
    bookmarkEditUrlWrapper.appendChild(bookmarkEditUrlError);

    const bookmarkEditSubmitButton = document.createElement('button');
    bookmarkEditSubmitButton.classList.add('form__buttons__button');
    bookmarkEditSubmitButton.classList.add('form__buttons__button--submit');
    bookmarkEditSubmitButton.innerHTML = 'Update';

    const bookmarkEditCancelButton = document.createElement('button');
    bookmarkEditCancelButton.classList.add('form__buttons__button');
    bookmarkEditCancelButton.classList.add('form__buttons__button--cancel');
    bookmarkEditCancelButton.type = 'button';
    bookmarkEditCancelButton.innerHTML = 'Cancel';
    bookmarkEditCancelButton.addEventListener('click', this.handleEditCancel);

    const bookmarkEditButtons = document.createElement('div');
    bookmarkEditButtons.classList.add('form__buttons');
    bookmarkEditButtons.appendChild(bookmarkEditSubmitButton);
    bookmarkEditButtons.appendChild(bookmarkEditCancelButton);

    const bookmarkEditFormFieldset = document.createElement('fieldset');
    bookmarkEditFormFieldset.classList.add('form__fieldset');
    bookmarkEditFormFieldset.appendChild(bookmarkEditFormLegend);
    bookmarkEditFormFieldset.appendChild(bookmarkEditNameWrapper);
    bookmarkEditFormFieldset.appendChild(bookmarkEditUrlWrapper);
    bookmarkEditFormFieldset.appendChild(bookmarkEditButtons);

    const bookmarkEditForm = document.createElement('form');
    bookmarkEditForm.classList.add('form');
    bookmarkEditForm.appendChild(bookmarkEditFormFieldset);

    const bookmarkEditFormWrapper = document.createElement('div');
    bookmarkEditFormWrapper.classList.add('bookmarks__bookmark__form-wrapper');
    bookmarkEditFormWrapper.appendChild(bookmarkEditForm);
    bookmarkEditFormWrapper.style.height = '0';

    const bookmarkListItem = document.createElement('li');
    bookmarkListItem.classList.add('bookmarks__bookmark');
    bookmarkListItem.classList.add(this.identifier);
    bookmarkListItem.appendChild(bookmarkLink);
    bookmarkListItem.appendChild(bookmarkEditButton);
    bookmarkListItem.appendChild(bookmarkDeleteButton);
    bookmarkListItem.appendChild(bookmarkEditFormWrapper);

    this.initialiseEditForm(bookmarkEditForm);
    this.setEditFormTabIndex(-1);

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
    this.createResizeObserver();
    this.editForm.onSuccess = (data) => {
      this.name = data.get('name');
      this.url = data.get('url');

      // Update DOM element to reflect changes
      const link = this.bookmarkElement.querySelector(
        '.bookmarks__bookmark__link',
      );
      link.innerHTML = this.name;
      link.href = this.url;

      this.hideEditPanel();

      this.onUpdate();
    };
  };

  /**
   * Set tagIndex of tabbable elements in edit form
   * @param {number} tabIndex New tabIndex value
   */
  setEditFormTabIndex = (tabIndex) => {
    const tabbableElements = Array.from(
      this.editForm.form.querySelectorAll('input, button, a'),
    );

    for (const element of tabbableElements) {
      element.tabIndex = tabIndex;
    }
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
    if (this.getCurrentEditPanelState() === 'hidden') {
      this.showEditPanel();
    } else {
      this.hideEditPanel();
    }
  };

  /**
   * Handle cancel click on edit form.
   */
  handleEditCancel = () => {
    this.hideEditPanel();
  };

  /**
   * Get current state (hidden or shown) of edit form.
   * @return {'hidden' | 'shown'}
   */
  getCurrentEditPanelState = () => {
    const formHeight = this.bookmarkElement.querySelector(
      '.bookmarks__bookmark__form-wrapper',
    ).style.height;
    return parseInt(formHeight) === 0 ? 'hidden' : 'shown';
  };

  /**
   * Show edit form for bookmark.
   */
  showEditPanel = () => {
    const fullHeight = this.bookmarkElement.querySelector('.form').scrollHeight;
    this.bookmarkElement.querySelector(
      '.bookmarks__bookmark__form-wrapper',
    ).style.height = `${fullHeight}px`;
    this.setEditFormTabIndex(0);
  };

  /**
   * Hide edit form for bookmark.
   */
  hideEditPanel = () => {
    this.bookmarkElement.querySelector(
      '.bookmarks__bookmark__form-wrapper',
    ).style.height = '0';
    this.setEditFormTabIndex(-1);
  };

  /**
   * Pause transition easing.
   */
  pauseEditPanelTransitionEasing = () => {
    this.bookmarkElement
      .querySelector('.bookmarks__bookmark__form-wrapper')
      .classList.add('bookmarks__bookmark__form-wrapper--pause-transition');
  };

  /**
   * Resume transition easing.
   */
  resumeEditPanelTransitionEasing = () => {
    this.bookmarkElement
      .querySelector('.bookmarks__bookmark__form-wrapper')
      .classList.remove('bookmarks__bookmark__form-wrapper--pause-transition');
  };

  /**
   * Create resize observer to observe form
   */
  createResizeObserver = () => {
    this.resizeObserver = new ResizeObserver(() => {
      // Recalculate height of panel if it is shown
      if (this.getCurrentEditPanelState() === 'shown') {
        this.pauseEditPanelTransitionEasing();
        this.showEditPanel();
        requestAnimationFrame(() => {
          this.resumeEditPanelTransitionEasing();
        });
      }
    });
    this.resizeObserver.observe(this.editForm.form);
  };

  /**
   * Remove relative DOM element.
   */
  remove = () => {
    if (this.editForm) {
      this.resizeObserver.unobserve(this.editForm.form);
      this.editForm.form
        .querySelector('.form__buttons__button--cancel')
        .removeEventListener('click', this.handleEditCancel);
      this.editForm.destroy();
    }
    if (this.bookmarkElement) {
      this.bookmarkElement
        .querySelector('.bookmarks__bookmark__button--delete')
        .removeEventListener('click', this.handleDeleteClick);
      this.bookmarkElement
        .querySelector('.bookmarks__bookmark__button--edit')
        .removeEventListener('click', this.handleEditClick);
      this.bookmarkElement.remove();
    }
    this.onRemove();
  };
}

export {Bookmark};
