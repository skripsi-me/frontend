export type ProductCategory = {
  name: string;
  slug: string;
  description: string;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  stock: number;
  image_url: string | null;
  category: ProductCategory;
  created_at: string;
  updated_at: string;
  total_sold?: number;
};

export type ProductListParams = {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
};

export type ProductPaginationParams = {
  page?: number;
  limit?: number;
};

export type CreateProductRequest = {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id: string;
  image_url?: string;
  image?: File;
};

export type UpdateProductRequest = Partial<CreateProductRequest>;
