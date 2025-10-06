# Inspection Single-Page Application

A single-page React application for managing inspection workflows, built with **React 19**, **Redux Toolkit**, **Bootstrap 5**, and **Vite 7**. The application provides the following core functionalities:
1. **List Inspection** – Displays inspections in three tabs: _Open_, _For Review_, and _Completed_.  
2. **Create Inspection** – Allows users to create new inspection records.  
3. **Detail Inspection** – Shows complete details of a selected inspection.

---

## Setup

### 1. Prerequisites
Make sure the following are installed:
- [Node.js](https://nodejs.org/en/download) **v22.20.0 (LTS)** or newer — includes npm.
- [Laravel 12](https://laravel.com/docs/12.x/installation) if you want to run the dummy backend API. The frontend itself does not require a real database connection.

### 2. Clone the Repository
```
git clone https://github.com/malvinlh/inosoft-fe-test.git
cd frontend
```

### 3. Install Dependencies
Install all packages listed in `package.json`:
```
npm install
```
This will automatically install all runtime and development dependencies, including:
- React 19, React DOM
- Redux Toolkit, React Redux
- React Router DOM 7
- Axios
- Bootstrap 5
- Vite 7
- Jest, Testing Library, and @swc/jest for unit tests
- ESLint for linting and code style checks

## How to Run

### 1. Start the Backend
```
cd backend
php artisan serve
```

### 2. Run the Frontend Development Server
In a separate terminal:
```
cd frontend
npm run dev
```
The app will start on http://localhost:5173

### 3. Build for Production
```
npm run build
```
The production-ready output will be located in the `/dist` directory. To preview the production build:
```
npm run preview
```

### 4. Run Unit Tests
```
npm run test
```

### 5. Linting and Code Quality
Check for lint issues:
```
npm run lint
```
Auto-fix issues:
```
npm run lint:fix
```

---

## Notes
1. Tech Stack Summary:
   - Framework: React 19
   - Build Tool: Vite 7
   - State Management: Redux Toolkit
   - Router: React Router DOM 7
   - HTTP Client: Axios
   - CSS Framework: Bootstrap 5
   - Testing: Jest + Testing Library
   - Linter: ESLint
   - Transpiler: SWC (@swc/jest)
2. Project Structure
3. Project Highlights
   - **Prefetching:** All dropdown data is loaded once on startup via Axios and stored in Redux. Further filtering is handled client-side.
   - **Atomic Design:** Components are structured in atoms → molecules → organisms → pages.
   - **Responsive Design:** Built with Bootstrap grid system and utilities.
   - **Clean Code:** ESLint enforces consistent and maintainable coding standards.
   - **Dummy Backend:** Uses mock JSON endpoints for testing without a database.
   - **Unit Tests:** Includes Jest-based component tests for inspection details and behavior.

## Author
Developed by **Malvin Leonardo Hartanto** for the INOSOFT Frontend Developer Technical Test.
