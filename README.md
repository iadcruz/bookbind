## What is BookBind?

BookBind is an app that allows users to browse popular books, filter by keyword, author, or title, and add books to a reading list to save for later.

## Features

1. User Authentication with Clerk
2. Responsive UI components (Shadcn, React, TypeScript)
3. Integration with Database using PostgreSQL (for storing user information and reading list information)
4. [Google Books API](https://developers.google.com/books/docs/v1/using) calls for movie/tv show data
5. App Deployment through Vercel

## Time Spent

This project took me ~4 hours to complete. Given more time, there are many other features/improvements I would like to implement, including but not limited to comment sections on books (where users can leave their reviews), follower capabilities (so that friends can follow each other and see what books their friends are reading), and more customizable reading lists (ability to remove from the list or prioritize different books).

## Running the Project

To view the deployed app, simply visit:

[https://bookbind.vercel.app](https://bookbind.vercel.app)

To run the project locally, first run the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
