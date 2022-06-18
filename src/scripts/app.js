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

    for (const {name, url} of initialBookmarks) {
      const newBookmark = new Bookmark(name, url);
      this.bookmarks.add(newBookmark);
      newBookmark.appendTo(this.bookmarksDisplayElement);
      newBookmark.onRemove(() => this.bookmarks.delete(newBookmark));
    }
  }
}

export {App};
