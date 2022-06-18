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
    const initialBookmarks = [{name: 'Google', url: 'https://www.google.com'}];
    this.bookmarks = [];
    this.bookmarksDisplayElement = document.querySelector('.bookmarks');
    this.form = new Form(document.querySelector('.add-bookmark-form'));

    for (const {name, url} of initialBookmarks) {
      const newBookmark = new Bookmark(name, url);
      this.bookmarks.push(newBookmark);
      if (newBookmark.active) {
        const newBookmarkListItem = newBookmark.generateBookmarkListItem();
        this.bookmarksDisplayElement.appendChild(newBookmarkListItem);
      }
    }
  }
}

export {App};
