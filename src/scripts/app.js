import {Bookmark} from '@scripts/bookmark';
import {Form} from '@scripts/form';

const BOOKMARKS_PER_PAGE = 2;

/**
 * Entry point.
 */
class App {
  /**
   * Create app.
   */
  constructor() {
    // Pages
    this.overviewPage = document.querySelector('.overview-page');
    this.successPage = document.querySelector('.success-page');
    this.showCorrectPage();

    // Bookmarks
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    this.bookmarks = [];

    this.bookmarksDisplayElement = document.querySelector('.bookmarks');

    for (const {name, url} of storedBookmarks) {
      this.createNewBookmark(name, url);
    }

    // Pagination
    this.currentPageNumber = 1;
    this.pagination = document.querySelector('.pagination');

    // Forms
    this.form = new Form(document.querySelector('.add-bookmark-form'));
    this.form.onSuccess = (data) => {
      // Create new Bookmark with form data and save to localStorage
      const name = data.get('name');
      const url = data.get('url');
      this.createNewBookmark(name, url);
      this.setLocalStorageToCurrentBookmarks();

      // Show correct details on success page
      this.successPage.querySelector('.success-bookmark-name').innerHTML = name;
      this.successPage.querySelector('.success-bookmark-url').innerHTML = url;
      this.goToSuccessPage();
    };

    // Render bookmark and pagination content
    this.navigateToPage(this.currentPageNumber);
  }

  /**
   * Create new bookmark instance.
   * @param {string} name Custom name for bookmark
   * @param {string} url URL of website to bookmark
   */
  createNewBookmark = (name, url) => {
    const newBookmark = new Bookmark(name, url);
    this.bookmarks[this.bookmarks.length] = newBookmark;
    newBookmark.onRemove = () => {
      // Remove bookmark from this.bookmarks and update localStorage
      const indexOfBookmark = this.bookmarks.indexOf(newBookmark);
      if (indexOfBookmark === -1) return;
      this.bookmarks.splice(indexOfBookmark, 1);
      this.setLocalStorageToCurrentBookmarks();

      // Append next bookmark
      const nextPageFirstBookmark =
        this.bookmarks[this.currentPageNumber * BOOKMARKS_PER_PAGE - 1];
      if (nextPageFirstBookmark) {
        nextPageFirstBookmark.appendTo(this.bookmarksDisplayElement);
      }

      // Update pagination
      const currentNumberPages = this.numberPages;
      this.numberPages = this.getNumberOfPages();
      if (currentNumberPages !== this.numberPages) {
        this.pagination.innerHTML = '';
        this.makePagination();
      }
    };
    newBookmark.onUpdate = () => {
      // Update localStorage
      this.setLocalStorageToCurrentBookmarks();
    };
  };

  /**
   * Add bookmarks to page with pagination.
   */
  addBookmarksToPage = () => {
    // Create new array of bookmarks only on this page
    const bookmarksOnThisPage = this.bookmarks.slice(
      (this.currentPageNumber - 1) * BOOKMARKS_PER_PAGE,
      this.currentPageNumber * BOOKMARKS_PER_PAGE,
    );
    // Append these to page
    for (const bookmark of bookmarksOnThisPage) {
      this.addBookmarkToPage(bookmark);
    }
  };

  /**
   * Add bookmark to page.
   * @param {Bookmark} bookmark Bookmark to be added to page
   */
  addBookmarkToPage = (bookmark) => {
    bookmark.appendTo(this.bookmarksDisplayElement);
  };

  /**
   * Set localStorage "bookmarks" key to current bookmarks.
   */
  setLocalStorageToCurrentBookmarks = () => {
    localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
  };

  /**
   * Create pagination DOM.
   */
  makePagination = () => {
    // Do not display pagination if no pages or one page
    if (!this.numberPages || this.numberPages === 1) return;

    // Create previous page link
    if (this.currentPageNumber > 1) {
      const pageLinkPrevious = document.createElement('a');
      pageLinkPrevious.innerHTML = 'Previous';
      pageLinkPrevious.href =
        this.currentPageNumber - 1 === 1
          ? '/'
          : `/?page=${this.currentPageNumber - 1}`;
      pageLinkPrevious.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToPage(this.currentPageNumber - 1);
      });
      this.pagination.appendChild(pageLinkPrevious);
    }

    // Create paginated links
    for (let i = 0; i < this.numberPages; i++) {
      // append pagination
      const pageLink = document.createElement('a');
      pageLink.innerHTML = i + 1;
      pageLink.href = i === 0 ? '/' : `/?page=${i + 1}`;
      pageLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToPage(i + 1);
      });
      this.pagination.appendChild(pageLink);
    }

    // Create next page link
    if (this.currentPageNumber < this.numberPages) {
      const pageLinkNext = document.createElement('a');
      pageLinkNext.innerHTML = 'Next';
      pageLinkNext.href = `/?page=${this.currentPageNumber + 1}`;
      pageLinkNext.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToPage(this.currentPageNumber + 1);
      });
      this.pagination.appendChild(pageLinkNext);
    }
  };

  /**
   * Get number of pages.
   * @return {number}
   */
  getNumberOfPages = () => {
    return Math.ceil(this.bookmarks.length / BOOKMARKS_PER_PAGE);
  };

  /**
   * Navigate to page.
   * @param {number} pageNumber Page number to navigate to
   */
  navigateToPage = (pageNumber) => {
    this.numberPages = this.getNumberOfPages();
    // Only allow current page number to be between 0 - number of pages
    this.currentPageNumber = Math.max(
      1,
      Math.min(pageNumber, this.numberPages),
    );
    // Remove bookmark DOM elements and render again with updated content
    this.bookmarksDisplayElement.innerHTML = '';
    this.addBookmarksToPage();
    // Remove pagination DOM elements and render again with updated content
    this.pagination.innerHTML = '';
    this.makePagination();
  };

  /**
   * Show correct page.
   */
  showCorrectPage = () => {
    if (window.location.pathname === '/#success') {
      this.goToSuccessPage();
    } else {
      this.goToOverviewPage();
    }
  };

  /**
   * Go to success page.
   */
  goToSuccessPage = () => {
    window.history.pushState({}, '', '/#success');
    this.overviewPage.classList.add('hide');
    this.successPage.classList.remove('hide');
  };

  /**
   * Go to overview page.
   */
  goToOverviewPage = () => {
    window.history.pushState({}, '', '/');
    this.overviewPage.classList.remove('hide');
    this.successPage.classList.add('hide');
  };
}

export {App};
