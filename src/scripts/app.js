import {Bookmark} from '@scripts/bookmark';
import {Form} from '@scripts/form';
import {PaginationLink} from './pagination-link';

const BOOKMARKS_PER_PAGE = 20;

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
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    this.bookmarks = [];

    this.bookmarksDisplayElement = document.querySelector('.bookmarks');

    for (const {name, url} of storedBookmarks) {
      this.createNewBookmark(name, url);
    }

    // Pagination
    this.paginationLinks = [];
    this.currentPageNumber = this.getCurrentPageNumber();
    this.pagination = document.querySelector('.pagination');

    // Forms
    this.form = new Form(document.querySelector('.form--add'));
    this.form.onSuccess = (data) => {
      // Create new Bookmark with form data and save to localStorage
      const name = data.get('name');
      const url = data.get('url');
      this.createNewBookmark(name, url);
      this.setLocalStorageToCurrentBookmarks();

      // Show correct details on success page
      this.successPage.querySelector('.success__title').innerHTML =
        'Thank you for submitting!';
      this.successPage.querySelector(
        '.success__text',
      ).innerHTML = `You added bookmark <strong>${name}</strong> which
        links to <strong>${url}</strong>.`;
      this.goToSuccessPage();
    };

    // Render bookmark and pagination content
    this.navigateToPage(this.currentPageNumber);

    // Show page
    document.body.classList.remove('loading');

    // Listen for url changes
    window.addEventListener('popstate', this.handlePopState);
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

      // Change page if necessary
      if (this.currentPageNumber > this.getNumberOfPages()) {
        this.navigateToPage(this.getNumberOfPages());
      } else {
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
          this.removePagination();
          this.makePagination();
        }
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
    const pageLinkPreviousHref =
      this.currentPageNumber - 1 === 1
        ? '/'
        : `/?page=${this.currentPageNumber - 1}`;
    const pageLinkPrevious = new PaginationLink(
      pageLinkPreviousHref,
      'Previous',
      this.currentPageNumber === 1,
      [
        'pagination__link',
        'pagination__link--previous',
        this.currentPageNumber === 1 && 'pagination__link--disabled',
      ],
      '<',
    );
    pageLinkPrevious.onClick = (e) => {
      e.preventDefault();
      this.navigateToPage(this.currentPageNumber - 1);
    };
    pageLinkPrevious.appendTo(this.pagination);
    this.paginationLinks.push(pageLinkPrevious);

    // Create paginated links
    for (let i = 0; i < this.numberPages; i++) {
      // append pagination
      const href = i === 0 ? '/' : `/?page=${i + 1}`;
      const pageLink = new PaginationLink(href, i + 1, false, [
        'pagination__link',
        i === this.currentPageNumber - 1 && 'pagination__link--active',
      ]);
      pageLink.onClick = (e) => {
        e.preventDefault();
        this.navigateToPage(i + 1);
      };
      pageLink.appendTo(this.pagination);
      this.paginationLinks.push(pageLink);
    }

    // Create next page link
    const pageLinkNextHref = `/?page=${this.currentPageNumber + 1}`;
    const pageLinkNext = new PaginationLink(
      pageLinkNextHref,
      'Next',
      this.currentPageNumber >= this.numberPages,
      [
        'pagination__link',
        'pagination__link--next',
        this.currentPageNumber >= this.numberPages &&
          'pagination__link--disabled',
      ],
      '>',
    );
    pageLinkNext.onClick = (e) => {
      e.preventDefault();
      this.navigateToPage(this.currentPageNumber + 1);
    };
    pageLinkNext.appendTo(this.pagination);
    this.paginationLinks.push(pageLinkNext);
  };

  /**
   * Remove pagination and cleanup
   */
  removePagination = () => {
    for (const link of this.paginationLinks) {
      // Remove DOM element and clean up
      link.remove();
    }
    this.paginationLinks = [];
  };

  /**
   * Get number of pages.
   * @return {number}
   */
  getNumberOfPages = () => {
    return Math.ceil(this.bookmarks.length / BOOKMARKS_PER_PAGE);
  };

  /**
   * Get current page number from URL query string.
   * @return {number}
   */
  getCurrentPageNumber = () => {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    return searchParams.get('page') || 1;
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
    // Remove pagination DOM elements and render again with updated content]
    this.removePagination();
    this.makePagination();
    // Update url history
    if (
      (this.currentPageNumber === 1 && window.location.search !== '') ||
      (this.currentPageNumber !== 1 &&
        window.location.search !== `?page=${this.currentPageNumber}`)
    ) {
      this.pushStateAndGoToTop(
        `${
          this.currentPageNumber === 1
            ? '/'
            : `/?page=${this.currentPageNumber}`
        }`,
      );
    }
  };

  /**
   * Show correct page.
   */
  showCorrectPage = () => {
    if (window.location.hash === '#success') {
      this.goToSuccessPage();
    } else {
      this.goToOverviewPage();
    }
  };

  /**
   * Go to success page.
   */
  goToSuccessPage = () => {
    if (window.location.hash !== '#success') {
      this.pushStateAndGoToTop(`/#success`);
    }
    this.overviewPage.classList.add('hide');
    this.successPage.classList.remove('hide');
  };

  /**
   * Go to overview page.
   */
  goToOverviewPage = () => {
    const queryString = window.location.search;
    if (window.location.hash !== '' && window.location.hash !== '#') {
      this.pushStateAndGoToTop(`/${queryString}`);
    }
    this.overviewPage.classList.remove('hide');
    this.successPage.classList.add('hide');
  };

  /**
   * Push url to history and scroll to top of page
   * @param {string} url Url to push to history
   */
  pushStateAndGoToTop = (url) => {
    window.history.pushState({}, '', url);
    window.scrollTo({top: 0, behavior: 'auto'});
  };

  /**
   * Handle pop state / page change
   */
  handlePopState = () => {
    this.showCorrectPage();
    this.currentPageNumber = this.getCurrentPageNumber();
    this.navigateToPage(this.currentPageNumber);
  };
}

export {App};
