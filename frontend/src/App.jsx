import AppRoutes from "./routes/AppRoutes";

import { CartProvider } from "./context/cart.context";
import { WishlistProvider } from "./context/wishlist.context";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <AppRoutes />
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;