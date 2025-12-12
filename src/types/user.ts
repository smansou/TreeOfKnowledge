export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  defaultView: "dashboard" | "tree" | "list";
  itemsPerPage: number;
  autoProcessContent: boolean;
  defaultCategoryId?: string;
  treeLayout: "horizontal" | "vertical";
  enableNotifications: boolean;
  reminderFrequency: "daily" | "weekly" | "never";
}

export interface AuthUser {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface UpdateUserRequest {
  name?: string;
  avatarUrl?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UserStats {
  totalKnowledgeItems: number;
  totalCategories: number;
  itemsThisWeek: number;
  favoriteContentType: "article" | "video" | "podcast" | "book";
  longestStreak: number;
  currentStreak: number;
}
