const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

let categories = [
  { id: 1, name: "Elektronik" },
  { id: 2, name: "Perabotan" },
];

let products = [
  { id: 1, name: "Laptop", category: categories[0] },
  { id: 2, name: "Perabotan", category: categories[1] },
  { id: 3, name: "Iphone 13", category: categories[0] },
  { id: 4, name: "Iphone 16", category: categories[0] },
];

// GET default
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to api SanberCode" });
});

// GET Category
app.get("/category", (req, res) => {
  res.status(200).json(categories);
});

// GET Detail Category
app.get("/category/:id", (req, res) => {
  const { id } = req.params;
  const category = categories.find((data) => data.id == id);
  if (category) {
    res.status(200).json(category);
  } else {
    res.status(400).json({
      message: "Category detail is not found",
    });
  }
});

// POST Category
app.post("/category", (req, res) => {
  const newCategory = req.body;
  newCategory.id = categories.length
    ? categories[categories.length - 1].id + 1
    : 1;
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

// PUT Category
app.put("/category/:id", (req, res) => {
  const { id } = req.params;
  const categoryIndex = categories.findIndex((data) => data.id == id);
  if (categoryIndex !== -1) {
    categories[categoryIndex] = { id: id, ...req.body };
    res.json(categories[categoryIndex]);
  } else {
    res.status(400).json({ message: "Category detail put is not found" });
  }
});

// DELETE Category
app.delete("/category/:id", (req, res) => {
  const { id } = req.params;
  categories = categories.filter((data) => data.id != id);
  res.status(200).json({
    message: "Data deleted",
    data: categories,
  });
});

// GET Category By Query
app.get("/product", (req, res) => {
  const query = req.query.query.toLowerCase();
  if (!query) {
    return res.status(400).json({ message: "Query parameter is missing" });
  }

  const searchProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query)
  );

  if (searchProducts.length == 0) {
    return res.status(400).json({ query, data: "No data" });
  }
  res.status(200).json({ query, data: searchProducts });
});

// GET Category By Query And Params
app.get("/category/:id/product", (req, res) => {
  const { id } = req.params;
  const searchQuery = req.query.searchQuery.toLowerCase();

  const categoryResult = categories.find((c) => c.id == id);

  const productResults = products
    .filter((k) => k.category.id == id)
    .filter((p) => p.name.toLowerCase().includes(searchQuery))
    .map((data) => ({ name: data.name, id: data.id }));
  res.json({
    id: id,
    category: categoryResult.name,
    products: productResults,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
