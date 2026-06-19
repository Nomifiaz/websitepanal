import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { createServer as createViteServer } from "vite";

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "uploads", "categories");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Ensure database folders/memory setup
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Store data in-memory with initial samples
let users = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
    role: "admin",
    createdAt: new Date("2026-06-19T07:22:15.000Z").toISOString(),
    updatedAt: new Date("2026-06-19T07:22:15.000Z").toISOString(),
  },
];

let categories = [
  {
    id: 1,
    name: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=400",
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Shoes",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400",
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=400",
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=400",
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Grocery",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ==========================================
// 1. User / Authentication Module (`/api/auth`)
// ==========================================

// Sign Up / Create User
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Validation error: Name, email and password are required.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Validation error: Validation isEmail on email failed",
    });
  }

  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({
      success: false,
      message: "Validation error: Email already registered",
    });
  }

  const newUser = {
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    name,
    email,
    password, // raw password stored for standard dev demonstration
    role: role || "user",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);

  // Return the customer representation
  const { password: _, ...userData } = newUser;
  return res.status(201).json({
    success: true,
    data: userData,
  });
});

// User Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Create mock token
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
    JSON.stringify({ id: user.id, email: user.email, role: user.role })
  )}.mock_signature`;

  const { password: _, ...userData } = user;
  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: userData,
  });
});

// Get profiles
app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const parts = token.split(".");
    if (parts.length >= 2) {
      const payload = JSON.parse(atob(parts[1]));
      const user = users.find((u) => u.id === payload.id);
      if (user) {
        const { password: _, ...userData } = user;
        return res.json({ success: true, user: userData });
      }
    }
  } catch (err) {
    // Ignore and unauthorized
  }

  return res.status(401).json({ success: false, message: "Invalid session" });
});

// ==========================================
// 2. Category Module (`/api/categories`)
// ==========================================

// Get All Categories
app.get("/api/categories", (req, res) => {
  const activeCategories = categories.filter((c) => !c.isDeleted);
  return res.json({
    success: true,
    message: "Categories fetched successfully",
    data: activeCategories,
  });
});

// Get Category by ID
app.get("/api/categories/:id", (req, res) => {
  const catId = parseInt(req.params.id, 10);
  const category = categories.find((c) => c.id === catId);

  if (!category || category.isDeleted) {
    return res.status(404).json({
      success: false,
      message: "Category not found or deleted",
    });
  }

  return res.json({
    success: true,
    data: category,
  });
});

// Create Category (multipart/form-data)
app.post("/api/categories", upload.single("imageUrl"), (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Category name is required.",
    });
  }

  let imageUrl = "";
  if (req.file) {
    imageUrl = `/uploads/categories/${req.file.filename}`;
  } else {
    // default category placeholder
    imageUrl = `https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400`;
  }

  const newCat = {
    id: categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1,
    name: name.trim(),
    imageUrl,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  categories.push(newCat);

  return res.status(201).json({
    success: true,
    data: newCat,
  });
});

// Update Category (multipart/form-data)
app.put("/api/categories/:id", upload.single("imageUrl"), (req, res) => {
  const catId = parseInt(req.params.id, 10);
  const categoryIndex = categories.findIndex((c) => c.id === catId);

  if (categoryIndex === -1 || categories[categoryIndex].isDeleted) {
    return res.status(404).json({
      success: false,
      message: "Category not found or deleted",
    });
  }

  const { name } = req.body;
  const currentCat = categories[categoryIndex];

  if (name !== undefined) {
    if (name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name cannot be empty.",
      });
    }
    currentCat.name = name.trim();
  }

  if (req.file) {
    currentCat.imageUrl = `/uploads/categories/${req.file.filename}`;
  }

  currentCat.updatedAt = new Date().toISOString();
  categories[categoryIndex] = currentCat;

  return res.json({
    success: true,
    data: currentCat,
  });
});

// Soft Delete Category
app.delete("/api/categories/:id", (req, res) => {
  const catId = parseInt(req.params.id, 10);
  const categoryIndex = categories.findIndex((c) => c.id === catId);

  if (categoryIndex === -1 || categories[categoryIndex].isDeleted) {
    return res.status(404).json({
      success: false,
      message: "Category not found or deleted",
    });
  }

  categories[categoryIndex].isDeleted = true;
  categories[categoryIndex].updatedAt = new Date().toISOString();

  return res.json({
    success: true,
    message: "Category deleted (soft delete) successfully",
  });
});

// ==========================================
// Start custom server / Vite middleware setup
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
