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

> **URL:** [PROD URL]

##### Initial Setup

- `yarn`
- `yarn build`
- Build files are output in the `/dist` folder

##### Deploy Process

Push to `main` branch in repository. This is set to auto-trigger a deploy.