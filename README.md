# Movie Tracker

A personal movie tracking application built with Next.js, TypeScript, and Prisma.

## Features

- User Authentication (Sign Up, Login, Logout)
- Personalized Watchlists
- Add, Update, and Delete Movies
- Filter Movies by Status
- Movie Statistics and Visualizations

## Tech Stack

- Next.js 15
- TypeScript
- Prisma (MySQL)
- NextAuth.js
- Tailwind CSS
- Chart.js

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/movie_tracker"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Next.js app directory
  - `api/` - API routes
  - `login/` - Login and signup page
  - `stats/` - Statistics page
- `components/` - Reusable components
- `lib/` - Utility functions and configurations
- `prisma/` - Database schema and migrations

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- User-specific data isolation
- Prepared statements for database queries

## Contributing

Feel free to submit issues and enhancement requests!
