"use client";

import Darkmode from "@/components/darkmode";
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import "./styles.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    publisher: string;
    description: string;
    publishedDate: string;
    categories: string[];
    imageLinks: {
      thumbnail: string;
    };
    previewLink: string;
  };
  saleInfo: {
    buyLink: string;
  };
  accessInfo: {
    pdf: {
      acsTokenLink: string;
    };
    epub: {
      acsTokenLink: string;
    };
  };
}

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const maxResults = 30;
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      setTimeout(() => {
        console.log(data.items);
        setBooks(data.items);
        setLoading(false);
      }, 5000);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setQuery(newSearch);
  };

  const handleSearch = (book: Book) => {
    setSelectedBook(book);
  };

  const handleClose = () => {
    setSelectedBook(null);
  };

  return (
    <section>
      <header>
        <div className="flex justify-evenly items-center gap-5 max-w-[1300px] mx-auto mt-7">
          <h1 className="text-[20px]">
            <span className="font-bold text-[35px]">B</span>ook Search
          </h1>
          <Darkmode />
        </div>
      </header>

      <div className="container">
        <form onSubmit={handleSubmit} className="form" name="books_search">
          <div className="inputGroup flex justify-center gap-3 items-center max-w-[1000px] mx-auto my-0 mt-8">
            <Input
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search the Book"
              className="Input_field"
              autoComplete="off"
              autoFocus
            />
            <Button type="submit" className="btn live">
              Search
            </Button>
          </div>
        </form>
        {loading && (
          <div className="hourglassBackground">
            <div className="hourglassContainer">
              <div className="hourglassCurves"></div>
              <div className="hourglassCapTop"></div>
              <div className="hourglassGlassTop"></div>
              <div className="hourglassSand"></div>
              <div className="hourglassSandStream"></div>
              <div className="hourglassCapBottom"></div>
              <div className="hourglassGlass"></div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap max-w-[1200px] justify-center gap-12 mx-auto my-0 mt-10 pb-10">
          {books.map((book) => (
            <Card>
              <div key={book.id} className="book-container">
                <CardHeader>
                  <img
                    src={
                      book.volumeInfo.imageLinks
                        ? book.volumeInfo.imageLinks.thumbnail
                        : "https://placehold.co/400x300/orange/white"
                    }
                    alt="Book cover"
                    onClick={() => handleSearch(book)}
                    className="book-cover"
                  />
                </CardHeader>
                <CardTitle>
                  <h2 className="book-title mb-6">{book.volumeInfo.title}</h2>
                </CardTitle>
                <CardContent>
                  <p className="flex justify-center items-center gap-5 text-center">
                    <span>Author(s)</span>
                    {book.volumeInfo.authors
                      ? book.volumeInfo.authors.join(", ")
                      : "Unknown"}
                  </p>
                  <p className="flex justify-center items-center gap-5 text-center mt-3">
                    <span>Publisher</span>
                    {book.volumeInfo.publisher
                      ? book.volumeInfo.publisher
                      : "Unknown"}
                  </p>
                </CardContent>
                <CardDescription>
                  <div className="flex justify-center items-center gap-5 flex-col">
                    {book.saleInfo.buyLink && (
                      <div>
                        <a
                          href={book.saleInfo.buyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gal-1"
                        >
                          <Button type="button" className="btn-2">
                            Buy
                          </Button>
                        </a>
                      </div>
                    )}
                    {book.accessInfo.pdf.acsTokenLink && (
                      <div>
                        <a
                          href={book.accessInfo.pdf.acsTokenLink}
                          className="main-3 btn-2"
                          download={book.volumeInfo.title}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download PDF
                        </a>
                      </div>
                    )}
                    {book.accessInfo.epub.acsTokenLink && (
                      <div>
                        <a
                          href={book.accessInfo.epub.acsTokenLink}
                          className="main-3 btn-2"
                          download={book.volumeInfo.title}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download EPUB
                        </a>
                      </div>
                    )}
                  </div>
                </CardDescription>
              </div>
            </Card>
          ))}
        </div>

        {selectedBook && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleClose}>
                &times;
              </span>
              <div className="flex justify-center items-center gap-5 flex-col">
                <img
                  src={
                    selectedBook.volumeInfo.imageLinks
                      ? selectedBook.volumeInfo.imageLinks.thumbnail
                      : "https://placehold.co/150x100/orange/white"
                  }
                  alt="Book cover"
                  className="book-cover"
                />
                <h2>{selectedBook.volumeInfo.title}</h2>
                <p className="text-black">
                  Author(s):{" "}
                  {selectedBook.volumeInfo.authors
                    ? selectedBook.volumeInfo.authors.join(", ")
                    : "Unknown"}
                </p>
                <p className="text-black">
                  Publisher:{" "}
                  {selectedBook.volumeInfo.publisher
                    ? selectedBook.volumeInfo.publisher
                    : "Unknown"}
                </p>
                <p className="text-black">
                  categories:{" "}
                  {selectedBook.volumeInfo.categories
                    ? selectedBook.volumeInfo.categories
                    : "Unknown"}
                </p>
                <p className="text-black">
                  Published Date:{" "}
                  {selectedBook.volumeInfo.publishedDate
                    ? selectedBook.volumeInfo.publishedDate
                    : "DD-MM-YYYY"}
                </p>
                <p className="text-black">
                  Description:{" "}
                  {selectedBook.volumeInfo.description
                    ? selectedBook.volumeInfo.description.length > 150
                      ? selectedBook.volumeInfo.description.substring(0, 150) +
                        "..."
                      : selectedBook.volumeInfo.description
                    : "No Data Found in this book"}
                </p>
                <div className="flex justify-center items-center gap-5">
                  {selectedBook.volumeInfo.previewLink && (
                    <div>
                      <a
                        href={selectedBook.volumeInfo.previewLink}
                        className="gal-1"
                      >
                        <Button
                          type="button"
                          className="p-4 hover:bg-black hover:text-white rounded"
                        >
                          Preview The Book
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
