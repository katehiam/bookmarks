# Bookmark Links

Maintains a list of bookmarks that the user is able to add/edit/delete.

- [Environment](#environments)
  - [Development](#development)
  - [Production](#production)

## Environments

### Development

> **URL:** http://localhost:8080

##### Initial Setup

- `yarn`

##### Run Process

- `yarn start`

### Production

> **URL:** https://brilliant-pie-2ccdb7.netlify.app/

##### Initial Setup

- `yarn`
- `yarn build`
- Build files are output in the `/dist` folder

##### Deploy Process

Push to `main` branch in repository, then merge `main` into `prod`. `prod` is set to auto-trigger a deploy.

# Technical Design Document

## 1. Introduction

The purpose of this document is to outline the design for the Bookmark Links website. This website should maintain a list of bookmark links. The user should be able to add, edit, and delete entries.

## 2. Requirements

### 2.1 Must Have

- Display list of bookmarks added by the user.
- Be able to add, edit, and delete bookmarks.
- Links must be paginated.
- Display a success message after adding a new bookmark.
- Links must persist on page reload.

### 2.2 Should Have

- Only use front-end technologies.
- Use vanilla JavaScript
- Work on Chrome, Firefox, Safari and Edge browsers on latest versions.
- Include responsive design.
- Form should validate that input exists and includes a valid URL.
- Success message should display the user's submission and include link back to home page.
- Have favicon and basic meta data.
- Have browser history functionality when navigating pages.
- Be simple to understand for the user.
- Include a project README.
- Clean up event listeners attached to elements when removing those elements from page.

### 2.3 Can Have

- Be nicely styled.
- Compile to optimised code.
- Have OG image.

### 2.4 Will Not Have

- Will not include server-side coding languages (e.g. PHP).
- Will not send form data to server.

## 3. System Overview

### 3.1 Technology Stack

**View:** HTML, Sass (compiled to CSS), JavaScript  
**Bundler:** Webpack  
**Hosting:** Netlify

## 4. Technical Approach

There will be one entry point to the site, which is through the index page. This will already include static HTML, such as the "Add bookmark" form, and empty slots for dynamic data, such as the list of bookmarks and pagination.

Bookmarks will be saved to `localStorage` when a change is made.

When the application is first constructed, it will first check to see if there are any bookmarks in `localStorage`, and if so will render these to the DOM.

When a bookmark is added, the application will keep track of these both in its own property and also in `localStorage`. The user will then be taken to the Success page, which will display a message to the user. This message needs to contain data from the form, and so the page will dynamically add this data to the message elements. Because of this, the Success page needs to live on the same page as the "Add bookmark" form (which is the index page) (no reload). The Home page elements will be hidden while the Success page is shown.

When a bookmark is edited, the application will update the DOM, update its own bookmarks array property, and update `localStorage`.

When a bookmark is deleted, the application will remove the link from the DOM, update its own bookmarks array property, and update `localStorage`. It will add the first link from the next paginated page (if it exists) so that the page still has the correct number of links.

Bookmark links will be paginated with 20 links per page. Pages will be navigatable by url (query string), as well as pagination links (no reload). The bookmarks to display on the current page will be calculated from the applications bookmarks array property. If a bookmark is deleted, the paginated links list will need to be recalculated.

Form fields will handle their own validation, with a form knowing which fields are it's children and able to iterate through to validate on submit.
