export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchResponse<T> {
  data: T[];
  query: string;
  total: number;
  took: number; // search time in ms
  facets?: SearchFacet[];
}

export interface SearchFacet {
  name: string;
  values: Array<{
    value: string;
    count: number;
  }>;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  // Computed fields
  usageCount?: number;
}

export interface CreateTagRequest {
  name: string;
}

export interface KnowledgeTag {
  knowledgeItemId: string;
  tagId: string;
}

// Generic data source interface for abstraction
export interface DataSourceResponse<T> {
  data: T;
  error?: string;
  isLoading?: boolean;
}

// Common loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Form states
export interface FormState<T> extends LoadingState {
  data: T;
  isDirty: boolean;
  isValid: boolean;
  errors: Record<string, string>;
}
