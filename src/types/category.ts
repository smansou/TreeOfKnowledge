export interface Category {
  id: string;
  userId: string;
  name: string;
  description?: string;
  parentId?: string;
  color?: string; // hex color code
  icon?: string;
  createdAt: string;
  updatedAt: string;
  // Computed fields for UI
  itemCount?: number;
  children?: Category[];
  path?: string[]; // breadcrumb path
}

export interface CategoryWithRelations extends Category {
  parent?: Category;
  children: Category[];
  knowledgeItems?: string[]; // knowledge item IDs
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  parentId?: string;
  color?: string;
  icon?: string;
}

export interface CategoryTree {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  itemCount: number;
  children: CategoryTree[];
}

export interface KnowledgeCategory {
  id: string;
  knowledgeItemId: string;
  categoryId: string;
  confidenceScore?: number; // AI confidence in categorization (0-1)
  createdAt: string;
}

export interface CategoryStats {
  totalCategories: number;
  maxDepth: number;
  itemsUncategorized: number;
  mostPopularCategories: Array<{
    category: Category;
    itemCount: number;
  }>;
}
