import {Bookmark} from '@scripts/bookmark';
import {Form} from '@scripts/form';

/**
 * Entry point.
 */
class App {
  /**
   * Create app.
   */
  constructor() {
    this.overviewPage = document.querySelector('.overview-page');
    this.successPage = document.querySelector('.success-page');
    this.showCorrectPage();

    const initialBookmarks = [{name: 'Google', url: 'https://www.google.com'}]; // TODO Replace with persisted links
    this.bookmarks = new Set();
    this.bookmarksDisplayElement = document.querySelector('.bookmarks');
    this.form = new Form(document.querySelector('.add-bookmark-form'));
    this.form.onSuccess = (data) => {
      const name = data.get('name');
      const url = data.get('url');
      this.createNewBookmark(name, url);
      this.form.reset();

      // Show correct details on success page
      this.successPage.querySelector('.success-bookmark-name').innerHTML = name;
      this.successPage.querySelector('.success-bookmark-url').innerHTML = url;
      this.goToSuccessPage();
    };

    for (const {name, url} of initialBookmarks) {
      this.createNewBookmark(name, url);
    }
  }

  /**
   * Create new bookmark instance.
   * @param {string} name Custom name for bookmark
   * @param {string} url URL of website to bookmark
   */
  createNewBookmark = (name, url) => {
    const newBookmark = new Bookmark(name, url);
    this.bookmarks.add(newBookmark);
    newBookmark.appendTo(this.bookmarksDisplayElement);
    newBookmark.onRemove(() => this.bookmarks.delete(newBookmark));
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
    console.log('going to overviw', this.overviewPage, this.successPage);
    window.history.pushState({}, '', '/');
    this.overviewPage.classList.remove('hide');
    this.successPage.classList.add('hide');
  };
}

export {App};
