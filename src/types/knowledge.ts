export interface KnowledgeItem {
  id: string;
  userId: string;
  title: string;
  contentType: "article" | "video" | "podcast" | "book";
  sourceUrl?: string;
  originalContent?: string;
  summary?: string;
  keyPoints?: string[];
  metadata?: KnowledgeItemMetadata;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
  categories?: string[]; // category IDs
  tags?: string[]; // tag names
}

export interface KnowledgeItemMetadata {
  author?: string;
  duration?: number; // in minutes for videos/podcasts
  publishDate?: string;
  readTime?: number; // in minutes for articles
  fileSize?: number; // for books/documents
  thumbnailUrl?: string;
  description?: string;
  language?: string;
}

export interface CreateKnowledgeItemRequest {
  title: string;
  contentType: KnowledgeItem["contentType"];
  sourceUrl?: string;
  originalContent?: string;
  summary?: string;
  keyPoints?: string[];
  metadata?: KnowledgeItemMetadata;
  categoryIds?: string[];
  tags?: string[];
}

export interface UpdateKnowledgeItemRequest {
  title?: string;
  summary?: string;
  keyPoints?: string[];
  metadata?: Partial<KnowledgeItemMetadata>;
  categoryIds?: string[];
  tags?: string[];
}

export interface KnowledgeItemFilters {
  contentType?: KnowledgeItem["contentType"];
  categoryIds?: string[];
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  hasContent?: boolean;
}

export interface KnowledgeItemSearchParams {
  query?: string;
  filters?: KnowledgeItemFilters;
  sortBy?: "createdAt" | "updatedAt" | "title" | "processedAt";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}
