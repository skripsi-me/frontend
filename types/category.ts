export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateCategoryRequest = {
  name: string;
  description?: string;
};

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;
