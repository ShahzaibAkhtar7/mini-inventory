Aapka README is liye kharab dikh raha hai kyunki Markdown ke andronic code blocks (`````) mein kuch jagah par code block ki formatting mix ho gayi hai aur headings ya spacing theek nahi hai.

Isay theek karne ke liye, aap apne root folder wali `README.md` file ko kholen, uss ka saara purana text delete kar dein, aur neechay diya gaya yeh **sahi aur clean format wala code** copy karke wahan paste kar dein. Yeh GitHub par bilkul professional aur saaf-suthra nazar aayega:

```markdown
# Mini Product Inventory System

A full-stack web application built as a technical assessment for a Full Stack Developer role. The system allows users to view available inventory, purchase products in real-time, and ensures strict concurrency safety to prevent negative stock.

---

## 🚀 Tech Stack

* **Frontend:** React, Tailwind CSS, Vite
* **Backend:** Node.js, Express.js (ES Modules)
* **Database:** MongoDB, Mongoose

---

## ✨ Features

* **Product Catalog:** Displays a list of products with their name, price, and available stock.
* **Instant Purchasing:** Users can select and buy products with immediate success/error feedback and real-time stock updates.
* **Admin Security:** Product creation (`POST /api/products`) is protected via an `x-admin-key` header.
* **Auto-Seeding:** Automatically seeds sample products on server startup if the database is empty for a smooth out-of-the-box experience.
* **Concurrency Control:** Atomic database operations prevent race conditions and negative inventory during simultaneous high-demand purchases.

---

## 🛠️ Project Structure

```text
inventory-system/
├── backend/
│   ├── models/
│   │   └── Product.js
│   ├── .env
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    └── package.json

```

---

## ⚙️ Installation & Running Locally

### Prerequisites

* Node.js installed on your machine.
* MongoDB running locally (Compass or Service) or a MongoDB Atlas URI.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd inventory-system

```

### 2. Setup Backend

```bash
cd backend
npm install

```

* Create a `.env` file inside the `backend` folder based on `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mini-inventory
ADMIN_API_KEY=my_secure_admin_key_123

```


* Start the backend server:
```bash
npm run dev

```



### 3. Setup Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev

```

Open your browser and navigate to `http://localhost:5173`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description | 
| --- | --- | --- | --- |
| **GET** | `/api/products` | Retrieve all products in inventory 
| **POST** | `/api/products` | Add a new product 
| **POST** | `/api/purchase/:id` | Purchase one unit of a product 

---

## 🔒 Handling the Concurrency Challenge (Race Conditions)

### The Problem

If only **one item** remains in stock and **two customers** attempt to purchase it simultaneously, a standard `find()` followed by an `update()` can lead to a race condition, allowing both transactions to succeed and resulting in negative inventory (`stock: -1`).

### The Solution

We solved this by using MongoDB's **atomic operation** via Mongoose's `findOneAndUpdate` combined with conditional querying:

```javascript
const updatedProduct = await Product.findOneAndUpdate(
  { _id: productId, stock: { $gt: 0 } }, {$inc: { stock: -1 } },           
  { returnDocument: 'after' }
);

```

**Why this works:**

1. MongoDB executes this query as a single, indivisible atomic step, serializing concurrent requests.
2. The condition `stock: { $gt: 0 }` guarantees that the update only occurs if stock is available.
3. If two requests hit simultaneously, the first request succeeds and decrements stock to `0`. The second request fails because the condition `stock > 0` is no longer met, returning `null` which triggers a `400 Bad Request` ("Out of stock") response.

```

```