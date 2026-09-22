# YouTube Clone

A responsive YouTube-style home feed built with React. It includes a YouTube Data API adapter in `src/youtubeApi.js`, search, category filters, responsive navigation, and a curated demo feed for local development.

## YouTube API setup

The app works immediately in demo mode. To use live YouTube search results:

1. Create a YouTube Data API v3 key in Google Cloud Console.
2. Create a `.env` file in the project root with `REACT_APP_YOUTUBE_API_KEY=your_key_here`.
3. Restart the development server.

The browser should never expose a production API key without restrictions. For production, proxy YouTube requests through a server and restrict the key by referrer and API quota.

## Available scripts

`npm start` runs the development server. `npm test -- --watchAll=false --runInBand` runs the test suite. `npm run build` creates a production build.

## CRA reference

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
# YouTube Clone

A responsive YouTube-style video browsing app built with React. Browse recommendations, search videos, filter by category, watch embedded content, and explore related videos through a clean desktop and mobile-friendly interface.

## Features

- Demo feed that works without an API key
- YouTube Data API v3 search integration
- Search, category filters, Explore sections, Shorts, and subscriptions views
- Embedded video watch page with related videos
- Watch Later, liked videos, and watch history
- Local demo sign-in and sign-out flow
- Playlist and upload UI placeholders for future API integration
- `localStorage` persistence for user data and library actions
- Responsive navigation and accessible interactive controls

## Tech stack

- React 19
- Create React App
- JavaScript and JSX
- `lucide-react` icons
- YouTube Data API v3

## Getting started

### Prerequisites

- Node.js and npm

### Install and run

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app starts in demo mode by default, so no API key is required for local development.

## Live YouTube data

To enable live search results:

1. Create a YouTube Data API v3 key in Google Cloud Console.
2. Enable the YouTube Data API v3 for the project.
3. Create a `.env` file in the project root:

```env
REACT_APP_YOUTUBE_API_KEY=your_api_key_here
```

4. Restart the development server.

The API key is exposed to the browser by Create React App. For production, use a backend proxy and restrict the key by referrer, API quota, and allowed APIs.

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the development server |
| `npm test` | Run the test suite in watch mode |
| `npm run build` | Create an optimized production build in `build/` |
| `npm run eject` | Eject from Create React App configuration |

## Project structure

```text
src/
	App.js          Main layout, navigation, video views, and app state
	App.css         Application styling
	youtubeApi.js   Demo data and YouTube API adapter
	index.js        React entry point
```

## Notes

The demo account, playlists, comments, and upload controls are local UI demonstrations. They do not connect to a real authentication, creator, or database service.
