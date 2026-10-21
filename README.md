# CineFlix

Yup, I'll explain later the project.

# To LAUNCH

1. Create a `.env` file
2. Then put your FREE key OMDb API
3. Your file should looks like this :

```js
VITE_OMDB_API_KEY=XXXXXXXX
```

<br>

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

<br>

## Features

- auto URL for each film selection
- "Load More" button
- Dark/Light mode
- fully responsive web page
- empty states for every "Lists"
- Error message if API fail
- Success message if API succeed
- Loading indicator
- "No result found" state if no result has been found
- in a list Detail : additional information are provided from the API
- Vue Router is used with parameters states
- hard save in Vuex (no loss on reload or shutdown of instance)
- watched/unWatched button for film
- Library creation, without duplication
- filter to sort film
- filter to search for a film in ou library
- filtre to search for a specific library
- Change name of a library + delete a library
- confirmation message when clicking on "Delete"
- sats on how many film y have in my Library + how many watched + how many unWatched

<br>

## Figma
```
https://www.figma.com/design/ouw6BrAHTKuycnKDMOGDtJ/Project---Interface?node-id=0-1&t=duWgMigdNnJUDZVH-1
```
