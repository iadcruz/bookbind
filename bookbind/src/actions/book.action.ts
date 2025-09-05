"use server";

const GOOGLE_BOOKS_BASE = "https://www.googleapis.com/books/v1/volumes";

export async function browseBooks(subject: string, maxResults: number = 20) {
  const url = `${GOOGLE_BOOKS_BASE}?q=subject:${encodeURIComponent(
    subject
  )}&maxResults=${maxResults}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch books");
  const data = await res.json();
  return data.items ?? [];
}

export async function searchBooks(query: string, maxResults: number = 20) {
  const url = `${GOOGLE_BOOKS_BASE}?q=${encodeURIComponent(
    query
  )}&maxResults=${maxResults}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to search books");
  const data = await res.json();
  return data.items ?? [];
}

export async function getBookById(id: string) {
  const url = `${GOOGLE_BOOKS_BASE}/${id}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch book details");
  return res.json();
}

export async function getSimilarBooks(
  author?: string,
  subject?: string,
  maxResults: number = 10
) {
  let query = "";
  if (author) query += `inauthor:${author}`;
  if (subject) query += (query ? "+" : "") + `subject:${subject}`;

  if (!query) throw new Error("Must provide author or subject for similarity");

  const url = `${GOOGLE_BOOKS_BASE}?q=${encodeURIComponent(
    query
  )}&maxResults=${maxResults}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch similar books");
  const data = await res.json();
  return data.items ?? [];
}
