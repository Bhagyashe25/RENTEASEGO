import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";

  // AUTH
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // ROLES
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      const u = stored ? JSON.parse(stored) : null;
      return u?.role === "admin";
    } catch {
      return false;
    }
  });
  const [isVendor, setIsVendor] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      const u = stored ? JSON.parse(stored) : null;
      return u?.role === "vendor";
    } catch {
      return false;
    }
  });

  // LOGIN POPUP
  const [showLogin, setShowLogin] = useState(false);
  const [loginType, setLoginType] = useState("user");

  // BOOKING DATES
  const [deliveryDate, setDeliveryDate] = useState("");
  const [pickupDate, setPickupDate] = useState("");

  // CART
  const [cartItems, setCartItems] = useState([]);

  // PRODUCTS
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // ADMIN DATA
  const [users, setUsers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  // SERVICE LOCATIONS
  const [serviceLocations, setServiceLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Sync token to axios headers + localStorage
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // FETCH USER
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        setIsAdmin(data.user.role === "admin");
        setIsVendor(data.user.role === "vendor");
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.log("Fetch user error:", err.message);
    }
  };

  // FETCH CART
  const fetchCart = async () => {
    try {
      const { data } = await axios.get("/api/cart/my-cart");
      if (data.success) setCartItems(data.carts);
    } catch (err) {
      console.log("Fetch cart error:", err.message);
    }
  };

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data } = await axios.get("/api/products");
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.log("Fetch products error:", err.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  // FETCH SERVICE LOCATIONS
  const fetchServiceLocations = async () => {
    try {
      setLoadingLocations(true);
      const { data } = await axios.get("/api/admin/service-areas");
      if (data.success) setServiceLocations(data.areas || []);
    } catch (err) {
      console.log("Fetch service locations error:", err.message);
      setServiceLocations([]);
    } finally {
      setLoadingLocations(false);
    }
  };

  // FETCH DASHBOARD DATA
  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard");
      setDashboardData(data.dashboard || {});
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    }
  };

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/admin/users");
      if (data.success) {
        setUsers(data.users);
        return data.users;
      }
      return [];
    } catch (err) {
      console.log("Fetch users error:", err.message);
      throw err;
    }
  };

  // FETCH RENTALS
  const fetchRentals = async () => {
    try {
      const { data } = await axios.get("/api/admin/rentals");
      if (data.success) setRentals(data.rentals);
    } catch (err) {
      console.log("Fetch rentals error:", err.message);
    }
  };

  // LOGIN (regular user or vendor)
  const login = async (email, password) => {
    try {
      const { data } = await axios.post("/api/user/login", { email, password });

      if (data.success) {
        setToken(data.token);

        if (data.user) {
          setUser(data.user);
          setIsAdmin(data.user.role === "admin");
          setIsVendor(data.user.role === "vendor");
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        toast.success("Login successful");
        setShowLogin(false);

        // Redirect based on role
        if (data.user?.role === "admin") {
          window.location.href = "/admin";
        } else if (data.user?.role === "vendor") {
          window.location.href = "/vendor";
        }
      } else {
        toast.error(data.message || "Invalid credentials");
        throw new Error(data.message || "Invalid credentials");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      // Only show toast if it hasn't been shown yet (avoid double toast)
      if (!err.response) {
        // already toasted above for data.success === false
      } else {
        toast.error(msg);
      }
      throw new Error(msg);
    }
  };

  // REGISTER
  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post("/api/user/register", { name, email, password });

      if (data.success) {
        setToken(data.token);
        toast.success("Account created successfully");
        setShowLogin(false);
      } else {
        toast.error(data.message || "Registration failed");
        throw new Error(data.message || "Registration failed");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Registration failed";
      if (err.response) toast.error(msg);
      throw new Error(msg);
    }
  };

  // LOGOUT
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAdmin(false);
    setIsVendor(false);
    setCartItems([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  // CHANGE ROLE (become Vendor)
  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");

      if (data.success) {
        setIsVendor(true);
        setUser((prev) => ({ ...prev, role: "vendor" }));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // ADMIN LOGIN
  const loginAdmin = async (email, password) => {
    try {
      const { data } = await axios.post("/api/user/login", { email, password });

      if (!data.success) {
        toast.error(data.message || "Invalid credentials");
        throw new Error(data.message || "Invalid credentials");
      }

      if (!data.user) {
        toast.error("User data not received");
        throw new Error("User data not received");
      }

      if (data.user.role !== "admin") {
        toast.error("Access denied. You are not an admin.");
        throw new Error("Access denied. You are not an admin.");
      }

      setToken(data.token);
      setUser(data.user);
      setIsAdmin(true);
      setIsVendor(false);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Admin login successful");
      setShowLogin(false);
      window.location.href = "/admin";

    } catch (err) {
      // If it's an axios network error (not our thrown Error), show toast
      if (err.response) {
        const msg = err.response.data?.message || "Login failed";
        toast.error(msg);
        throw new Error(msg);
      }
      // Otherwise re-throw (toast already shown above)
      throw err;
    }
  };

  // REMOVE CART ITEM
  const removeCartItem = async (cartId) => {
    try {
      const { data } = await axios.post("/api/cart/remove", { cartId });

      if (data.success) {
        fetchCart();
        toast.success("Item removed from cart");
      } else {
        toast.error(data.message || "Failed to remove item");
      }
    } catch (error) {
      console.error("Remove cart item error:", error);
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  // ADD TO CART
  const addToCart = async (productId, location, tenure, deliveryDate, pickupDate, orderType) => {
    if (!token) {
      setShowLogin(true);
      return;
    }
    try {
      const { data } = await axios.post("/api/cart/create", {
        productId,
        location,
        tenure,
        deliveryDate,
        pickupDate,
        orderType,
      });

      if (data.success) {
        toast.success("Added to cart");
        await fetchCart();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // CHECKOUT
  const checkout = async (cartIds) => {
    try {
      const { data } = await axios.post("/api/cart/checkout", { cartIds });

      if (data.success) {
        fetchCart();
        toast.success("Order placed successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order");
    }
  };

  // Load user + cart when token is available
  useEffect(() => {
    if (token) {
      fetchUser();
      fetchCart();
      fetchServiceLocations();
    }
  }, [token]);

  // Load products on app start
  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    currency,
    token,
    setToken,
    user,
    setUser,
    isAdmin,
    isVendor,
    showLogin,
    setShowLogin,
    loginType,
    setLoginType,
    deliveryDate,
    setDeliveryDate,
    pickupDate,
    setPickupDate,
    cartItems,
    products,
    loadingProducts,
    fetchProducts,
    login,
    register,
    logout,
    changeRole,
    addToCart,
    checkout,
    fetchUser,
    fetchCart,
    loginAdmin,
    users,
    setUsers,
    fetchUsers,
    rentals,
    setRentals,
    fetchRentals,
    dashboardData,
    setDashboardData,
    fetchDashboardData,
    serviceLocations,
    setServiceLocations,
    fetchServiceLocations,
    loadingLocations,
    removeCartItem,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);