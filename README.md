# Velmora integrated application

This package contains the React/Vite frontend and Express/MongoDB backend with authentication, feedback, product, cart and Razorpay routes aligned under `/api`.

## Setup

1. Copy `backend/.env.example` to `backend/.env` and provide `MONGO_URI` and `JWT_SECRET`.
2. Copy `frontend/.env.example` to `frontend/.env`. Add the Razorpay public key only if payments are enabled.
3. In separate terminals, run:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Open `http://localhost:5173`. Vite proxies `/api` to the backend on port 3000.

## Required and optional services

- MongoDB and `JWT_SECRET` are required for backend startup.
- Google OAuth, ImageKit and Razorpay are optional until those features are used.
- Set `FRONTEND_URL` to the deployed frontend origin in production.
- Set `VITE_API_BASE_URL` to the deployed backend API URL (ending in `/api`) when frontend and backend are hosted separately.

## Integration notes

- Registration, login, current-user loading, Google login, and contact feedback now call the backend.
- The bundled catalog is synchronized into MongoDB automatically whenever the backend starts.
- Checkout securely maps the local storefront cart to MongoDB catalog records, ignores client-supplied prices, then creates the Razorpay order from the server-side total.
- A buyer must register or log in before checkout so the server can associate the cart and payment with that user.
- User roles are read from the `role` field in MongoDB. New accounts default to `buyer`; to grant seller access, update the account to `role: "seller"` in the `users` collection. Seller accounts can open the account menu and choose `Seller Dashboard` to manage products. Image uploads require `IMAGEKIT_PRIVATE_KEY`.
