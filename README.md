Markdown# Mini Product Inventory System

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
mini-inventory-system/
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
⚙️ Installation & Running LocallyPrerequisitesNode.js installed on your machine.MongoDB running locally (Compass or Service) or a MongoDB Atlas URI.1. Clone the RepositoryBashgit clone <your-repository-url>
cd mini-inventory-system
2. Setup BackendBashcd backend
npm install
Create a .env file inside the backend folder based on .env.example:Code snippetPORT=5000
MONGO_URI=mongodb://localhost:27017/mini-inventory
ADMIN_API_KEY=my_secure_admin_key_123
Start the backend server:Bashnpm run dev
3. Setup FrontendOpen a new terminal window:Bashcd frontend
npm install
npm run dev
Open your browser and navigate to http://localhost:5173.🔌 API EndpointsMethodEndpointDescriptionProtected?GET/api/productsRetrieve all products in inventoryNoPOST/api/productsAdd a new productYes (x-admin-key)POST/api/purchase/:idPurchase one unit of a productNo🔒 Handling the Concurrency Challenge (Race Conditions)The ProblemIf only one item remains in stock and two customers attempt to purchase it simultaneously, a standard find() followed by an update() can lead to a race condition, allowing both transactions to succeed and resulting in negative inventory (stock: -1).The SolutionWe solved this by using MongoDB's atomic operation via Mongoose's findOneAndUpdate combined with conditional querying:JavaScriptconst updatedProduct = await Product.findOneAndUpdate(
  { _id: productId, stock: { $gt: 0 } }, // Ensures stock is greater than 0 {$inc: { stock: -1 } },           // Atomically decrements stock by 1
  { returnDocument: 'after' }
);
Why this works:MongoDB executes this query as a single, indivisible atomic step, serializing concurrent requests.The condition stock: { $gt: 0 } guarantees that the update only occurs if stock is available.If two requests hit simultaneously, the first request succeeds and decrements stock to 0. The second request fails because the condition stock > 0 is no longer met, returning null which triggers a 400 Bad Request ("Out of stock") response.