import type {
  KnowledgeItem,
  Category,
  User,
  Tag,
  UserPreferences,
} from "../../types";

// Mock User
export const mockUser: User = {
  id: "user-1",
  email: "demo@example.com",
  name: "Demo User",
  avatarUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
  preferences: {
    theme: "system",
    defaultView: "dashboard",
    itemsPerPage: 20,
    autoProcessContent: true,
    treeLayout: "vertical",
    enableNotifications: true,
    reminderFrequency: "weekly",
  } as UserPreferences,
};

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: "cat-1",
    userId: "user-1",
    name: "Technology",
    description: "All things tech-related",
    color: "#3B82F6",
    icon: "laptop",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    itemCount: 25,
  },
  {
    id: "cat-2",
    userId: "user-1",
    name: "Machine Learning",
    description: "AI and ML related content",
    parentId: "cat-1",
    color: "#8B5CF6",
    icon: "brain",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    itemCount: 15,
  },
  {
    id: "cat-3",
    userId: "user-1",
    name: "Web Development",
    description: "Frontend and backend development",
    parentId: "cat-1",
    color: "#059669",
    icon: "code",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    itemCount: 10,
  },
  {
    id: "cat-4",
    userId: "user-1",
    name: "Business",
    description: "Business strategy and entrepreneurship",
    color: "#DC2626",
    icon: "briefcase",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    itemCount: 8,
  },
  {
    id: "cat-5",
    userId: "user-1",
    name: "Health & Wellness",
    description: "Health, fitness, and mental wellness",
    color: "#EA580C",
    icon: "heart",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    itemCount: 12,
  },
  {
    id: "cat-6",
    userId: "user-1",
    name: "Deep Learning",
    description: "Neural networks and deep learning techniques",
    parentId: "cat-2",
    color: "#7C3AED",
    icon: "network",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
    itemCount: 6,
  },
];

// Mock Tags
export const mockTags: Tag[] = [
  {
    id: "tag-1",
    userId: "user-1",
    name: "beginner-friendly",
    createdAt: "2024-01-01T00:00:00Z",
    usageCount: 15,
  },
  {
    id: "tag-2",
    userId: "user-1",
    name: "advanced",
    createdAt: "2024-01-01T00:00:00Z",
    usageCount: 8,
  },
  {
    id: "tag-3",
    userId: "user-1",
    name: "tutorial",
    createdAt: "2024-01-01T00:00:00Z",
    usageCount: 12,
  },
  {
    id: "tag-4",
    userId: "user-1",
    name: "research",
    createdAt: "2024-01-01T00:00:00Z",
    usageCount: 5,
  },
  {
    id: "tag-5",
    userId: "user-1",
    name: "practical",
    createdAt: "2024-01-01T00:00:00Z",
    usageCount: 20,
  },
  {
    id: "tag-6",
    userId: "user-1",
    name: "case-study",
    createdAt: "2024-01-01T00:00:00Z",
    usageCount: 7,
  },
  {
    id: "tag-7",
    userId: "user-1",
    name: "best-practices",
    createdAt: "2024-01-01T00:00:00Z",
    usageCount: 18,
  },
];

// Mock Knowledge Items
export const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: "item-1",
    userId: "user-1",
    title: "Introduction to Machine Learning",
    contentType: "article",
    sourceUrl: "https://example.com/ml-intro",
    summary:
      "Comprehensive overview of machine learning fundamentals, covering supervised and unsupervised learning, feature engineering, and model evaluation techniques.",
    keyPoints: [
      "Supervised vs Unsupervised Learning",
      "Feature Engineering Best Practices",
      "Cross-validation and Model Evaluation",
      "Bias-Variance Tradeoff",
    ],
    metadata: {
      author: "Dr. Sarah Chen",
      publishDate: "2024-01-15",
      readTime: 15,
      description:
        "A beginner-friendly guide to understanding machine learning concepts",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
    },
    categories: ["cat-2"],
    tags: ["beginner-friendly", "tutorial", "practical"],
    processedAt: "2024-01-15T10:30:00Z",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "item-2",
    userId: "user-1",
    title: "Building Modern React Applications",
    contentType: "video",
    sourceUrl: "https://youtube.com/watch?v=example",
    summary:
      "Complete guide to building scalable React applications with hooks, context, and modern development patterns.",
    keyPoints: [
      "React Hooks and Custom Hooks",
      "State Management with Context",
      "Performance Optimization",
      "Testing Strategies",
    ],
    metadata: {
      author: "Tech Academy",
      duration: 120,
      publishDate: "2024-01-10",
      description: "Master modern React development",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
    },
    categories: ["cat-3"],
    tags: ["advanced", "tutorial", "best-practices"],
    processedAt: "2024-01-10T15:00:00Z",
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T15:00:00Z",
  },
  {
    id: "item-3",
    userId: "user-1",
    title: "The Lean Startup Methodology",
    contentType: "book",
    sourceUrl: "https://example.com/lean-startup",
    summary:
      "Eric Ries presents a scientific approach to creating and managing successful startups in an age of uncertainty.",
    keyPoints: [
      "Build-Measure-Learn Feedback Loop",
      "Minimum Viable Product (MVP)",
      "Validated Learning",
      "Innovation Accounting",
    ],
    metadata: {
      author: "Eric Ries",
      publishDate: "2011-09-13",
      description: "A guide to continuous innovation",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
    },
    categories: ["cat-4"],
    tags: ["advanced", "case-study", "practical"],
    processedAt: "2024-01-08T09:00:00Z",
    createdAt: "2024-01-08T08:30:00Z",
    updatedAt: "2024-01-08T09:00:00Z",
  },
  {
    id: "item-4",
    userId: "user-1",
    title: "Mindfulness and Productivity",
    contentType: "podcast",
    sourceUrl: "https://example.com/mindfulness-podcast",
    summary:
      "Discussion on how mindfulness practices can enhance productivity and reduce workplace stress.",
    keyPoints: [
      "Daily Meditation Practices",
      "Mindful Task Management",
      "Stress Reduction Techniques",
      "Work-Life Balance",
    ],
    metadata: {
      author: "Wellness Weekly",
      duration: 45,
      publishDate: "2024-01-12",
      description: "Transform your work habits with mindfulness",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop",
    },
    categories: ["cat-5"],
    tags: ["beginner-friendly", "practical"],
    processedAt: "2024-01-12T16:00:00Z",
    createdAt: "2024-01-12T15:30:00Z",
    updatedAt: "2024-01-12T16:00:00Z",
  },
  {
    id: "item-5",
    userId: "user-1",
    title: "Deep Learning with PyTorch",
    contentType: "article",
    sourceUrl: "https://example.com/pytorch-deep-learning",
    summary:
      "Advanced tutorial on implementing neural networks using PyTorch framework for computer vision tasks.",
    keyPoints: [
      "PyTorch Fundamentals",
      "Convolutional Neural Networks",
      "Transfer Learning",
      "Model Optimization",
    ],
    metadata: {
      author: "AI Research Lab",
      publishDate: "2024-01-18",
      readTime: 25,
      description: "Master deep learning with PyTorch",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop",
    },
    categories: ["cat-6"],
    tags: ["advanced", "research", "tutorial"],
    processedAt: "2024-01-18T11:00:00Z",
    createdAt: "2024-01-18T10:30:00Z",
    updatedAt: "2024-01-18T11:00:00Z",
  },
  {
    id: "item-6",
    userId: "user-1",
    title: "Next.js App Router Complete Guide",
    contentType: "video",
    sourceUrl: "https://youtube.com/watch?v=nextjs-app-router",
    summary:
      "Comprehensive walkthrough of Next.js App Router, covering server components, routing, and data fetching.",
    keyPoints: [
      "Server vs Client Components",
      "File-based Routing System",
      "Data Fetching Strategies",
      "Streaming and Suspense",
    ],
    metadata: {
      author: "Next.js Experts",
      duration: 90,
      publishDate: "2024-01-20",
      description: "Master the new Next.js App Router",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop",
    },
    categories: ["cat-3"],
    tags: ["advanced", "tutorial", "best-practices"],
    processedAt: "2024-01-20T14:00:00Z",
    createdAt: "2024-01-20T13:30:00Z",
    updatedAt: "2024-01-20T14:00:00Z",
  },
];

// Helper function to generate random IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper function to get items by category
export function getItemsByCategory(categoryId: string): KnowledgeItem[] {
  return mockKnowledgeItems.filter((item) =>
    item.categories?.includes(categoryId)
  );
}

// Helper function to get categories with item counts
export function getCategoriesWithCounts(): Category[] {
  return mockCategories.map((category) => ({
    ...category,
    itemCount: getItemsByCategory(category.id).length,
  }));
}
