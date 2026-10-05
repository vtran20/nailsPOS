# Nail System (POS + Check-In Frontend)

Nail System is a React + Redux web application for nail salon operations. It provides a **Point of Sale (POS) workflow** for front-desk staff and a **Check-In experience** for customer intake, with support for appointments, services, employees, customers, and payment tracking.

The app is built with Create React App, Material-UI, Redux Thunk, and Redux Form, and connects to backend APIs for authentication and operational data.

## What this project does

- Authenticates staff users with an API-backed sign-in flow
- Loads store-specific operational data (customers, appointments, services, employees, payments)
- Supports POS workflows such as:
  - selecting/searching customers
  - adding/editing service selections
  - assigning employees
  - calculating totals and handling checkout/payment states
- Includes a check-in oriented UI flow
- Persists parts of client state to local storage for faster continuity
- Periodically refreshes data to keep POS views current

## Tech stack

- **Frontend:** React 16, React DOM
- **State management:** Redux, React-Redux, Redux Thunk, Redux Form, Reselect
- **UI:** Material-UI v3
- **Utilities:** Moment, Lodash, Immer, React DnD, React Autosuggest
- **Build tooling:** Create React App (`react-scripts`)
- **Containerization:** Docker (Node 14 Alpine)

## Project structure (high level)

```text
src/
  actions/        # Redux action creators + async API logic
  components/     # UI components (POS, check-in, dialogs, layouts)
  pages/          # Top-level screens (App, SignIn, POS, CheckIn)
  selectors/      # Derived Redux selectors
  store/          # Reducers and store setup
  utils.js        # API URLs, helpers, field renderers, formatters
```

## Prerequisites

- Node.js 14+ (project includes Dockerfile based on `node:14-alpine`)
- npm
- A running backend API expected by `src/utils.js` (default: `http://localhost:8080`)

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm start
   ```
3. Open:
   - `http://localhost:3000`

## Build for production

```bash
npm run build
```

The production-ready files are generated in `build/`.

## Run with Docker (optional)

Build image:

```bash
docker build -t nailssystem .
```

Run container:

```bash
docker run --rm -p 3000:80 nailssystem
```

> Note: The current Dockerfile runs `npm start` after build. If you want a static production server, you may later switch to `serve -s build` or an Nginx-based image.

## GitHub initialization steps

If this project is not yet on GitHub, run these commands from the project root:

```bash
git init
git add .
git commit -m "Initial commit: Nail System frontend"
git branch -M main
git remote add origin git@github.com:<your-username>/<your-repo>.git
git push -u origin main
```

If this repo is already initialized and you only need to push to a new GitHub remote:

```bash
git remote remove origin
git remote add origin git@github.com:<your-username>/<your-repo>.git
git push -u origin main
```

## Notes

- API endpoints are currently defined in `src/utils.js`.
- Ensure backend auth/CORS settings allow requests from your frontend origin.
- This is for testing purpose
