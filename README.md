# Media Tracker

A comprehensive application for tracking movies, books, and songs. Built with Next.js, Prisma, and MySQL.

## Features

- Track movies, books, and songs in one place
- Organize media by status (Want to Watch/Read/Listen, Currently Watching/Reading/Listening, Watched/Read/Listened)
- Filter and search across all media types
- Genre-based organization
- User authentication and data privacy
- Responsive design for all devices

## Database Structure

### Indexes and Query Optimization

1. **Movie Table Indexes**
   - `@@index([userId])` - Optimizes user-specific movie queries
   - `@@index([userId, status])` - Improves status-based filtering
   - Used in: Movie list views, filtering, and statistics

2. **Book Table Indexes**
   - `@@index([userId])` - Optimizes user-specific book queries
   - `@@index([userId, status])` - Improves reading progress tracking
   - Used in: Book list views, filtering, and reading statistics

3. **Song Table Indexes**
   - `@@index([userId])` - Optimizes user-specific song queries
   - `@@index([userId, status])` - Improves listening progress tracking
   - Used in: Song list views, filtering, and listening statistics

### Database Access Methods

1. **ORM (Prisma) Usage (80%)**
   - Used for all CRUD operations
   - Automatic query parameterization
   - Type-safe database operations
   - Used in all API routes under `/app/api/`

2. **Prepared Statements (20%)**
   - Implemented through Prisma's query builder
   - Used for complex filtering operations
   - Automatically handles SQL injection protection
   - Used in list pages for filtering and sorting

## Dynamic UI Components

1. **Movie Tracker**
   - Dynamic genre selection
   - Status-based filtering
   - Search functionality
   - Progress tracking

2. **Book Tracker**
   - Dynamic genre selection
   - Author-based filtering
   - Reading progress tracking
   - Search functionality

3. **Song Tracker**
   - Dynamic genre selection
   - Artist and album filtering
   - Listening progress tracking
   - Search functionality

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/media_tracker"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema

### User Model

model User {
  id            Int      @id @default(autoincrement())
  email         String   @unique
  passwordHash  String
  createdAt     DateTime @default(now())
  movies        Movie[]
  books         Book[]
  songs         Song[]
}
```

### Movie Model

model Movie {
  id        Int      @id @default(autoincrement())
  userId    Int
  title     String
  genres    Json?    @default("[]")
  status    MovieStatus @default(WANT_TO_WATCH)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([userId, status])
}
```

### Book Model

model Book {
  id        Int      @id @default(autoincrement())
  userId    Int
  title     String
  author    String
  genres    Json?    @default("[]")
  status    BookStatus @default(WANT_TO_READ)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([userId, status])
}
```

### Song Model

model Song {
  id        Int      @id @default(autoincrement())
  userId    Int
  title     String
  artist    String
  album     String?
  genres    Json?    @default("[]")
  status    SongStatus @default(WANT_TO_LISTEN)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([userId, status])
}
```

## Security Features

1. **Authentication**
   - Secure user authentication with NextAuth.js
   - Password hashing with bcrypt
   - Session management

2. **Database Security**
   - Automatic SQL injection protection through Prisma
   - Parameterized queries for all database operations
   - User-specific data isolation

3. **API Security**
   - Protected API routes
   - User verification for all operations
   - Input validation and sanitization

## Performance Optimization

1. **Database Optimization**
   - Strategic indexing for common queries
   - Efficient relationship handling
   - Optimized query patterns

2. **Frontend Optimization**
   - Client-side filtering and sorting
   - Efficient state management
   - Responsive design patterns


