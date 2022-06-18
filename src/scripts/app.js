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

    this.currentPageNumber = 1;
    this.numberPages = Math.ceil(this.bookmarks.length / BOOKMARKS_PER_PAGE);
    this.pagination = document.querySelector('.pagination');
    this.makePagination();
    this.addBookmarksToPage();

    // Forms
    this.form = new Form(document.querySelector('.add-bookmark-form'));
    this.form.onSuccess = (data) => {
      const name = data.get('name');
      const url = data.get('url');
      this.createNewBookmark(name, url);

      localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));

      // Show correct details on success page
      this.successPage.querySelector('.success-bookmark-name').innerHTML = name;
      this.successPage.querySelector('.success-bookmark-url').innerHTML = url;
      this.goToSuccessPage();
    };
  }

  /**
   * Create new bookmark instance.
   * @param {string} name Custom name for bookmark
   * @param {string} url URL of website to bookmark
   */
  createNewBookmark = (name, url) => {
    const newBookmark = new Bookmark(name, url);
    this.bookmarks[this.bookmarks.length] = newBookmark;
    newBookmark.onRemove(() => this.bookmarks.delete(newBookmark));
  };

  /**
   * Create pagination DOM.
   */
  makePagination = () => {
    if (!this.numberPages || this.numberPages === 1) return;

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
   * Add bookmarks to page with pagination.
   */
  addBookmarksToPage = () => {
    const bookmarksOnThisPage = Array.from(this.bookmarks).slice(
      (this.currentPageNumber - 1) * BOOKMARKS_PER_PAGE,
      this.currentPageNumber * BOOKMARKS_PER_PAGE,
    );
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
   * Navigate to page.
   * @param {number} pageNumber Page number to navigate to
   */
  navigateToPage = (pageNumber) => {
    this.currentPageNumber = Math.max(
      1,
      Math.min(pageNumber, this.numberPages),
    );
    this.bookmarksDisplayElement.innerHTML = '';
    this.pagination.innerHTML = '';
    this.makePagination();
    this.addBookmarksToPage();
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
