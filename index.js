const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const {
  SwaggerUIBundle,
  SwaggerUIStandalonePreset,
} = require("swagger-ui-dist");

const cros = require("cors");


const app = express();

const port = 3000;

// Load Swagger JSON documentation from a file
const options = {
  swaggerDefinition: require("./swagger.json"),
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css",
  })
);

// Sample data for the book library
const books = [
  { id: 1, title: "Sample Book 1", author: "Author 1", publishedYear: 2020 },
  { id: 2, title: "Sample Book 2", author: "Author 2", publishedYear: 2019 },
];

app.use(cros());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://swagger-api-documentation-nodejs.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});
app.use(express.json());

// Get a list of books
app.get("/books", (req, res) => {
  res.status(200).json(books);
});

// Add a new book
app.post("/books", (req, res) => {
  const newBook = req.body;
  books.push(newBook);
  res.status(201).json({ message: "Book added successfully" });
});

// Get book details by ID
app.get("/books/:bookId", (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const book = books.find((b) => b.id === bookId);
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Update book details by ID
app.put("/books/:bookId", (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const updatedBook = req.body;
  const index = books.findIndex((b) => b.id === bookId);
  if (index !== -1) {
    books[index] = { ...books[index], ...updatedBook };
    res.status(200).json({ message: "Book updated successfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Delete book by ID
app.delete("/books/:bookId", (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const index = books.findIndex((b) => b.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
