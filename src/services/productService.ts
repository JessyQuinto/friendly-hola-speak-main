import { apiRequest } from '@/lib/api';
import type { Product, ProductsQuery, PaginationInfo } from '@/types';

interface ProductsResponse {
  data: Product[];
  pagination: PaginationInfo;
}

export const productService = {
  // Get all products with optional filtering and pagination
  getProducts: async (query: ProductsQuery = {}): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    
    if (query.featured !== undefined) {
      params.append('featured', query.featured.toString());
    }
    if (query.categoryId) {
      params.append('categoryId', query.categoryId.toString());
    }
    if (query.producerId) {
      params.append('producerId', query.producerId.toString());
    }
    if (query.searchTerm) {
      params.append('searchTerm', query.searchTerm);
    }
    if (query.page) {
      params.append('page', query.page.toString());
    }
    if (query.pageSize) {
      params.append('pageSize', query.pageSize.toString());
    }

    const response = await apiRequest<Product[]>({
      method: 'GET',
      url: `/products?${params.toString()}`,
    });

    return {
      data: response.data,
      pagination: response.pagination!,
    };
  },

  // Get featured products
  getFeaturedProducts: async (limit: number = 6): Promise<Product[]> => {
    const response = await productService.getProducts({
      featured: true,
      pageSize: limit,
    });
    return response.data;
  },

  // Get product by ID
  getProduct: async (id: number): Promise<Product> => {
    const response = await apiRequest<Product>({
      method: 'GET',
      url: `/products/${id}`,
    });
    return response.data;
  },

  // Get product by slug
  getProductBySlug: async (slug: string): Promise<Product> => {
    // Since the API uses ID, we'll need to search by name or implement slug endpoint
    // For now, we'll assume the backend supports slug lookup
    const response = await apiRequest<Product>({
      method: 'GET',
      url: `/products/${slug}`,
    });
    return response.data;
  },

  // Search products
  searchProducts: async (searchTerm: string, page: number = 1, pageSize: number = 12): Promise<ProductsResponse> => {
    return productService.getProducts({
      searchTerm,
      page,
      pageSize,
    });
  },

  // Get products by category
  getProductsByCategory: async (categoryId: number, page: number = 1, pageSize: number = 12): Promise<ProductsResponse> => {
    return productService.getProducts({
      categoryId,
      page,
      pageSize,
    });
  },

  // Get products by producer
  getProductsByProducer: async (producerId: number, page: number = 1, pageSize: number = 12): Promise<ProductsResponse> => {
    return productService.getProducts({
      producerId,
      page,
      pageSize,
    });
  },
};

export default productService;