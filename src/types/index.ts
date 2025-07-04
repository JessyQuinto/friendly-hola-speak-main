// User types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'User' | 'Admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshTokenExpiresIn?: number;
}

// Product types
export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Producer {
  id: number;
  name: string;
  description?: string;
  location: string;
  contactEmail?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountedPrice?: number;
  currentPrice: number;
  hasDiscount: boolean;
  image: string;
  images: string[];
  categoryId: number;
  category: Category;
  producerId: number;
  producer: Producer;
  stock: number;
  isInStock: boolean;
  featured: boolean;
  rating: number;
  status: 'Active' | 'Inactive';
  isAvailableForPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

// Cart types
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    id: number;
    name: string;
    currentPrice: number;
    image: string;
    stock: number;
    isInStock: boolean;
  };
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  region: string;
  zipCode: string;
  phone: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: {
    id: number;
    name: string;
    slug: string;
    image: string;
  };
}

export interface Order {
  id: number;
  userId: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
  total: number;
  totalItems: number;
  paymentMethod: 'CreditCard' | 'DebitCard' | 'BankTransfer' | 'Cash';
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export interface CartUpdateRequest {
  id: number;
  userId: number;
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
  total: number;
}

export interface CreateOrderRequest {
  paymentMethod: 'CreditCard' | 'DebitCard' | 'BankTransfer' | 'Cash';
  shippingAddress: ShippingAddress;
  notes?: string;
}

// Query parameters
export interface ProductsQuery {
  featured?: boolean;
  categoryId?: number;
  producerId?: number;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}