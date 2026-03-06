# 🛍️ LocalMart — Hyperlocal Marketplace

A full-stack hyperlocal marketplace where buyers discover and purchase products from sellers within a **10km radius** of their location. Built with the MERN stack, Stripe payments, and MongoDB geospatial queries.

🔗 **Live Demo:** [localmart.vercel.app](https://localmart.vercel.app)  
🔗 **Backend API:** [localmart-backend.onrender.com](https://localmart-backend.onrender.com)

---

## 💳 Test the Payment Flow

This app uses **Stripe in test mode** — no real money is charged.

| Field | Value |
|-------|-------|
| Card Number | `4242 4242 4242 4242` |
| Expiry | Any future date (e.g. `12/34`) |
| CVC | Any 3 digits (e.g. `123`) |
| Name/ZIP | Anything |

---

## ✨ Features

### 🛒 Buyer
- Browse products from nearby sellers (within 10km)
- Search products by name, category, or description
- Add to cart with quantity management (persists on refresh)
- Checkout with Stripe payment
- View order history with real-time status

### 🏪 Seller
- Create a store with live location detection
- Add, edit, and manage products with image upload
- View and manage incoming customer orders
- Update order status (Confirmed → Shipped → Delivered)
- Revenue and order stats dashboard

### 🔐 Auth & General
- JWT-based authentication
- Role-based access control (Buyer / Seller)
- Dark mode support
- Fully responsive design
- Location-based filtering with toggle (show all / nearby only)

---

## 🗂️ Project Structure

```
localmart/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── storeController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── multer.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Store.js
│   │   ├── Product.js
│   │   └── Order.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── storeRoutes.js
│   │   ├── orderRoutes.js
│   │   └── paymentRoutes.js
│   │
│   └── server.js
│
└── frontend/
    ├── node_modules/
    ├── public/
    ├── services/
    │   └── api.js
    │
    └── src/
        ├── assets/
        │
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProductCard.jsx
        │   ├── CheckoutForm.jsx
        │   └── Hero.jsx
        │
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── CartContext.jsx
        │   └── ThemeContext.jsx
        │
        ├── pages/
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   └── Signup.jsx
        │   │
        │   ├── seller/
        │   │   ├── AddProduct.jsx
        │   │   ├── CreateStore.jsx
        │   │   ├── EditProduct.jsx
        │   │   ├── SellerDashboard.jsx
        │   │   └── SellerOrders.jsx
        │   │
        │   ├── user/
        │   │   ├── CartPage.jsx
        │   │   ├── Checkout.jsx
        │   │   └── MyOrders.jsx
        │   │
        │   ├── Home.jsx
        │   ├── MyProfile.jsx
        │   └── SuccessPage.jsx
        │
        ├── App.jsx
        ├── App.css
        ├── main.jsx
        └── index.css
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| Payments | Stripe |
| Image Upload | Cloudinary + Multer |
| Location | Browser Geolocation API + MongoDB 2dsphere |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Stripe account
- Cloudinary account

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/localmart.git
cd localmart
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `.env` in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

Create `.env` in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

```bash
npm run dev
```

### 4. Open the app
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## 🌍 Deployment

| Service | Purpose | URL |
|---------|---------|-----|
| Vercel | Frontend hosting | [vercel.com](https://vercel.com) |
| Render | Backend hosting | [render.com](https://render.com) |
| MongoDB Atlas | Database | [mongodb.com/atlas](https://mongodb.com/atlas) |

### Environment Variables for Production

**Render (Backend):**
```
MONGO_URI=your_atlas_uri
JWT_SECRET=your_secret
STRIPE_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**Vercel (Frontend):**
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 📸 Screenshots

> Add screenshots here after deployment

| Home Page | Product Cart | Checkout |
|-----------|-------------|----------|
| ![home]() | ![cart]() | ![checkout]() |

| Seller Dashboard | Order History | Success Page |
|-----------------|--------------|-------------|
| ![dashboard]() | ![orders]() | ![success]() |

---

## 🔑 Test Accounts

You can register your own accounts or use these test credentials:

| Role | Email | Password |
|------|-------|----------|
| Buyer | buyer@test.com | test1234 |
| Seller | seller@test.com | test1234 |

> **Note:** Allow location access when prompted for the 10km filter to work.

---

## 📋 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (supports `?search=&latitude=&longitude=`) |
| POST | `/api/products` | Add product (seller only) |
| PUT | `/api/products/:id` | Update product (seller only) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order after payment |
| GET | `/api/orders/my-orders` | Buyer's order history |
| GET | `/api/orders/seller-orders` | Seller's incoming orders |
| PATCH | `/api/orders/:id/status` | Update order status (seller only) |

### Payment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create-payment-intent` | Create Stripe payment intent |

---

## 👨‍💻 Author

**Your Name**  
📧 sksrv8416@email.com  
🔗 [LinkedIn](https://www.linkedin.com/in/sourav-kumar-82b424201/)  
🐙 [GitHub](https://github.com/sksrv)  

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
