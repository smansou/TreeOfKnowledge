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

// Base data source interface for all entities
export interface BaseDataSource {
  isLoading: boolean;
  error: string | null;
}

// Knowledge Items Data Source Interface
export interface KnowledgeDataSource extends BaseDataSource {
  // CRUD operations
  getKnowledgeItems(params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    contentType?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedResponse<KnowledgeItem>>;

  getKnowledgeItem(id: string): Promise<ApiResponse<KnowledgeItem>>;

  createKnowledgeItem(
    data: CreateKnowledgeItemRequest
  ): Promise<ApiResponse<KnowledgeItem>>;

  updateKnowledgeItem(
    id: string,
    data: UpdateKnowledgeItemRequest
  ): Promise<ApiResponse<KnowledgeItem>>;

  deleteKnowledgeItem(id: string): Promise<ApiResponse<null>>;

  // Search functionality
  searchKnowledgeItems(
    params: KnowledgeItemSearchParams
  ): Promise<SearchResponse<KnowledgeItem>>;
}

// Categories Data Source Interface
export interface CategoryDataSource extends BaseDataSource {
  getCategories(): Promise<ApiResponse<Category[]>>;

  getCategoryTree(): Promise<ApiResponse<Category[]>>;

  getCategory(id: string): Promise<ApiResponse<Category>>;

  createCategory(data: CreateCategoryRequest): Promise<ApiResponse<Category>>;

  updateCategory(
    id: string,
    data: UpdateCategoryRequest
  ): Promise<ApiResponse<Category>>;

  deleteCategory(id: string): Promise<ApiResponse<null>>;
}

// Tags Data Source Interface
export interface TagDataSource extends BaseDataSource {
  getTags(): Promise<ApiResponse<Tag[]>>;

  createTag(data: CreateTagRequest): Promise<ApiResponse<Tag>>;
}

// Authentication Data Source Interface
export interface AuthDataSource extends BaseDataSource {
  login(credentials: LoginRequest): Promise<ApiResponse<User>>;

  signup(data: SignupRequest): Promise<ApiResponse<User>>;

  logout(): Promise<ApiResponse<null>>;

  getCurrentUser(): Promise<ApiResponse<User>>;

  updateUser(data: UpdateUserRequest): Promise<ApiResponse<User>>;
}

// Combined data source interface
export interface DataSource {
  knowledge: KnowledgeDataSource;
  categories: CategoryDataSource;
  tags: TagDataSource;
  auth: AuthDataSource;
}
