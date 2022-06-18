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
    const initialBookmarks = [{name: 'Google', url: 'https://www.google.com'}]; // TODO Replace with persisted links
    this.bookmarks = new Set();
    this.bookmarksDisplayElement = document.querySelector('.bookmarks');
    this.form = new Form(document.querySelector('.add-bookmark-form'));
    this.form.onSuccess = (data) => {
      this.createNewBookmark(data.get('name'), data.get('url'));
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
}

export {App};
