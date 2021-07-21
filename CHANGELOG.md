# Changelog

## 0.8.9
- Added function to get country emoji from country code
- Added max age to static files

## 0.8.8
- Added possibility to set the limit for how much data can be received

## 0.8.7
- Added subpage functionality so a controller can include another controller for rendering

## 0.8.6
- Added a function to require all files in a directory into a single object

## 0.8.5
- Fixed error handling for adding first admin user

## 0.8.4
- Updated gulp so npm js is copied over when deleting coffeescript files
- Added the function to make admin users with a first user token to regular API
- Made the function to add the first admin user return a status 501 if no first-user-token is provided in environment variables

## 0.8.3
- Updated gulp so npm css is copied over when deleting css files
- Removed is_admin from hidden on user model

## 0.8.2
- Updated dependencies

## 0.8.1
- Allowed self signed SSL certificates for knex
- Updated how PAGE_ORIGIN is handled so it correctly redirects on heroku

## 0.7.8
- Changed currency pug function to default to USD
– Fixed issue with hidden fields for user models

## 0.7.7
- Changed so tests stop after running
- Added email rendering capabilities
- Changed gulp script so email styles are compiled
- Changed the way domains are handled so it only enforces the domain on production

## 0.7.6
- Changed frontend build so Coffeescript is handled the same for development and production
- Added useAsset so fingerprinted images can be used for production from pug

## 0.7.5
- Fixed an issue where a number of dependencies were being required despite not being used when running a static site

## 0.7.4
- Updated sessions so only the session id is used to locate sessions
- Added possibility to add auth definitions in the app/security directory for api.yaml consumption
- Made gulp more flexible in the way it uses styles/scripts/fonts from npm

## 0.7.3
- Testing added to boilerplate
- Added some testing for user routes

## 0.7.2
- Functionality to use openapi to declare routes
- Allowing models to use uuid
- Streamlined error handling
- Improved documentation

## 0.6.3
- Updated the package so only relevant dependencies get loaded (frontend or backend)
- Finished the setup for frontend, including for static frontends

## 0.6
- Made the experience of setting up a new project smoother

## 0.5.0
- Added functionality so new models can be created with the CLI

## 0.4.0
- Updated documentation
- Made boilerplate for new projects
- Updated the user adding CLI method so it also adds the right files

## 0.3.3
- Bugfix: ensured only admins can make admins

## 0.3.2
- Bugfix: Fixed CORS

## 0.3.1
- Bugfix: Updated standard user migration so users are not admins by default
- Added a route to add a new user

## 0.3.0
- Added session/user models, controllers and middleware so sessions gets authen
- Added a number of utility functions

## 0.2.0
- Added CLI so the knex migration for users/sessions can easily be added to a project

## 0.1.0
- Users/sessions
- App setup
- Bookshelf/knex setup
