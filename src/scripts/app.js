/**
 * Entry point.
 */
class App {
  /**
   * Create app.
   */
  constructor() {
    this.bookmarks = [{name: 'Test', url: 'https://google.com'}];
    this.bookmarksDisplayElement = document.querySelector('.bookmarks');

    for (const {name, url} of this.bookmarks) {
      const newBookmarkLink = document.createElement('a');
      newBookmarkLink.innerHTML = name;
      newBookmarkLink.href = url;
      newBookmarkLink.target = '_blank';

      const newBookmarkListItem = document.createElement('li');
      newBookmarkListItem.appendChild(newBookmarkLink);

      this.bookmarksDisplayElement.appendChild(newBookmarkListItem);
    }
  }
}

export {App};
