import type {
  KnowledgeItem,
  CreateKnowledgeItemRequest,
  UpdateKnowledgeItemRequest,
  KnowledgeItemSearchParams,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Tag,
  CreateTagRequest,
  User,
  LoginRequest,
  SignupRequest,
  UpdateUserRequest,
  ApiResponse,
  PaginatedResponse,
  SearchResponse,
} from "../../types";
import {
  mockKnowledgeItems,
  mockCategories,
  mockTags,
  mockUser,
  generateId,
  getItemsByCategory,
  getCategoriesWithCounts,
} from "../mocks/fixtures";

import type {
  DataSource,
  KnowledgeDataSource,
  CategoryDataSource,
  TagDataSource,
  AuthDataSource,
} from "./types";

// Simulate network delay
const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock Knowledge Data Source
class MockKnowledgeDataSource implements KnowledgeDataSource {
  isLoading = false;
  error: string | null = null;

  private items = [...mockKnowledgeItems];

  async getKnowledgeItems(params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    contentType?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedResponse<KnowledgeItem>> {
    await delay();

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    let filteredItems = [...this.items];

    // Apply filters
    if (params?.categoryId) {
      filteredItems = filteredItems.filter((item) =>
        item.categories?.includes(params.categoryId!)
      );
    }

    if (params?.contentType) {
      filteredItems = filteredItems.filter(
        (item) => item.contentType === params.contentType
      );
    }

    // Apply sorting
    if (params?.sortBy) {
      filteredItems.sort((a, b) => {
        const aValue = a[params.sortBy as keyof KnowledgeItem] as string;
        const bValue = b[params.sortBy as keyof KnowledgeItem] as string;
        const modifier = params.sortOrder === "desc" ? -1 : 1;

        if (aValue < bValue) return -1 * modifier;
        if (aValue > bValue) return 1 * modifier;
        return 0;
      });
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return {
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total: filteredItems.length,
        totalPages: Math.ceil(filteredItems.length / limit),
        hasNext: endIndex < filteredItems.length,
        hasPrev: page > 1,
      },
    };
  }

  async getKnowledgeItem(id: string): Promise<ApiResponse<KnowledgeItem>> {
    await delay();

    const item = this.items.find((item) => item.id === id);
    if (!item) {
      throw new Error("Knowledge item not found");
    }

    return {
      success: true,
      data: item,
    };
  }

  async createKnowledgeItem(
    data: CreateKnowledgeItemRequest
  ): Promise<ApiResponse<KnowledgeItem>> {
    await delay(800); // Simulate processing time

    const newItem: KnowledgeItem = {
      id: generateId(),
      userId: mockUser.id,
      title: data.title,
      contentType: data.contentType,
      sourceUrl: data.sourceUrl,
      originalContent: data.originalContent,
      summary: data.summary,
      keyPoints: data.keyPoints,
      metadata: data.metadata,
      categories: data.categoryIds,
      tags: data.tags,
      processedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.items.unshift(newItem);

    return {
      success: true,
      data: newItem,
      message: "Knowledge item created successfully",
    };
  }

  async updateKnowledgeItem(
    id: string,
    data: UpdateKnowledgeItemRequest
  ): Promise<ApiResponse<KnowledgeItem>> {
    await delay();

    const itemIndex = this.items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      throw new Error("Knowledge item not found");
    }

    const updatedItem = {
      ...this.items[itemIndex],
      ...data,
      categories: data.categoryIds,
      updatedAt: new Date().toISOString(),
    };

    this.items[itemIndex] = updatedItem;

    return {
      success: true,
      data: updatedItem,
      message: "Knowledge item updated successfully",
    };
  }

  async deleteKnowledgeItem(id: string): Promise<ApiResponse<null>> {
    await delay();

    const itemIndex = this.items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      throw new Error("Knowledge item not found");
    }

    this.items.splice(itemIndex, 1);

    return {
      success: true,
      data: null,
      message: "Knowledge item deleted successfully",
    };
  }

  async searchKnowledgeItems(
    params: KnowledgeItemSearchParams
  ): Promise<SearchResponse<KnowledgeItem>> {
    await delay();

    let filteredItems = [...this.items];

    // Apply search query
    if (params.query) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.title.toLowerCase().includes(params.query!.toLowerCase()) ||
          item.summary?.toLowerCase().includes(params.query!.toLowerCase())
      );
    }

    // Apply filters
    if (params.filters?.contentType) {
      filteredItems = filteredItems.filter(
        (item) => item.contentType === params.filters!.contentType
      );
    }

    if (params.filters?.categoryIds && params.filters.categoryIds.length > 0) {
      filteredItems = filteredItems.filter((item) =>
        item.categories?.some((cat) =>
          params.filters!.categoryIds!.includes(cat)
        )
      );
    }

    // Apply pagination
    const limit = params.limit || 20;
    const offset = params.offset || 0;
    const paginatedItems = filteredItems.slice(offset, offset + limit);

    return {
      data: paginatedItems,
      query: params.query || "",
      total: filteredItems.length,
      took: Math.random() * 100,
      facets: [
        {
          name: "contentType",
          values: [
            {
              value: "article",
              count: filteredItems.filter((i) => i.contentType === "article")
                .length,
            },
            {
              value: "video",
              count: filteredItems.filter((i) => i.contentType === "video")
                .length,
            },
            {
              value: "podcast",
              count: filteredItems.filter((i) => i.contentType === "podcast")
                .length,
            },
            {
              value: "book",
              count: filteredItems.filter((i) => i.contentType === "book")
                .length,
            },
          ],
        },
      ],
    };
  }
}

// Mock Category Data Source
class MockCategoryDataSource implements CategoryDataSource {
  isLoading = false;
  error: string | null = null;

  private categories = [...mockCategories];

  async getCategories(): Promise<ApiResponse<Category[]>> {
    await delay();
    const categoriesWithCounts = getCategoriesWithCounts();

    return {
      success: true,
      data: categoriesWithCounts,
    };
  }

  async getCategoryTree(): Promise<ApiResponse<Category[]>> {
    await delay();

    // Build hierarchical tree structure
    const buildTree = (parentId?: string): Category[] => {
      return this.categories
        .filter((cat) => cat.parentId === parentId)
        .map((cat) => ({
          ...cat,
          children: buildTree(cat.id),
          itemCount: getItemsByCategory(cat.id).length,
        }));
    };

    const tree = buildTree();

    return {
      success: true,
      data: tree,
    };
  }

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    await delay();

    const category = this.categories.find((cat) => cat.id === id);
    if (!category) {
      throw new Error("Category not found");
    }

    return {
      success: true,
      data: category,
    };
  }

  async createCategory(
    data: CreateCategoryRequest
  ): Promise<ApiResponse<Category>> {
    await delay();

    const newCategory: Category = {
      id: generateId(),
      userId: mockUser.id,
      name: data.name,
      description: data.description,
      parentId: data.parentId,
      color: data.color || "#3B82F6",
      icon: data.icon || "folder",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      itemCount: 0,
    };

    this.categories.push(newCategory);

    return {
      success: true,
      data: newCategory,
      message: "Category created successfully",
    };
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryRequest
  ): Promise<ApiResponse<Category>> {
    await delay();

    const categoryIndex = this.categories.findIndex((cat) => cat.id === id);
    if (categoryIndex === -1) {
      throw new Error("Category not found");
    }

    const updatedCategory = {
      ...this.categories[categoryIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.categories[categoryIndex] = updatedCategory;

    return {
      success: true,
      data: updatedCategory,
      message: "Category updated successfully",
    };
  }

  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    await delay();

    const categoryIndex = this.categories.findIndex((cat) => cat.id === id);
    if (categoryIndex === -1) {
      throw new Error("Category not found");
    }

    // Check if category has children
    const hasChildren = this.categories.some((cat) => cat.parentId === id);
    if (hasChildren) {
      throw new Error("Cannot delete category with subcategories");
    }

    this.categories.splice(categoryIndex, 1);

    return {
      success: true,
      data: null,
      message: "Category deleted successfully",
    };
  }
}

// Mock Tag Data Source
class MockTagDataSource implements TagDataSource {
  isLoading = false;
  error: string | null = null;

  private tags = [...mockTags];

  async getTags(): Promise<ApiResponse<Tag[]>> {
    await delay();

    return {
      success: true,
      data: this.tags,
    };
  }

  async createTag(data: CreateTagRequest): Promise<ApiResponse<Tag>> {
    await delay();

    // Check if tag already exists
    const existingTag = this.tags.find(
      (tag) => tag.name.toLowerCase() === data.name.toLowerCase()
    );

    if (existingTag) {
      return {
        success: true,
        data: existingTag,
      };
    }

    const newTag: Tag = {
      id: generateId(),
      userId: mockUser.id,
      name: data.name,
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };

    this.tags.push(newTag);

    return {
      success: true,
      data: newTag,
      message: "Tag created successfully",
    };
  }
}

// Mock Auth Data Source
class MockAuthDataSource implements AuthDataSource {
  isLoading = false;
  error: string | null = null;

  private user = { ...mockUser };

  async login(credentials: LoginRequest): Promise<ApiResponse<User>> {
    await delay();

    if (
      credentials.email === "demo@example.com" &&
      credentials.password === "password"
    ) {
      return {
        success: true,
        data: this.user,
        message: "Login successful",
      };
    }

    throw new Error("Invalid credentials");
  }

  async signup(data: SignupRequest): Promise<ApiResponse<User>> {
    await delay();

    const newUser: User = {
      id: generateId(),
      email: data.email,
      name: data.name || "New User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        theme: "system",
        defaultView: "dashboard",
        itemsPerPage: 20,
        autoProcessContent: true,
        treeLayout: "vertical",
        enableNotifications: true,
        reminderFrequency: "weekly",
      },
    };

    return {
      success: true,
      data: newUser,
      message: "Account created successfully",
    };
  }

  async logout(): Promise<ApiResponse<null>> {
    await delay(100);

    return {
      success: true,
      data: null,
      message: "Logged out successfully",
    };
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(200);

    return {
      success: true,
      data: this.user,
    };
  }

  async updateUser(data: UpdateUserRequest): Promise<ApiResponse<User>> {
    await delay();

    this.user = {
      ...this.user,
      name: data.name ?? this.user.name,
      avatarUrl: data.avatarUrl ?? this.user.avatarUrl,
      preferences: data.preferences
        ? { ...this.user.preferences, ...data.preferences }
        : this.user.preferences,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: this.user,
      message: "User updated successfully",
    };
  }
}

// Create mock data source instance
export const mockDataSource: DataSource = {
  knowledge: new MockKnowledgeDataSource(),
  categories: new MockCategoryDataSource(),
  tags: new MockTagDataSource(),
  auth: new MockAuthDataSource(),
};
