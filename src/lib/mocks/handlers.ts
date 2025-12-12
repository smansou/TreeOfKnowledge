import { http, HttpResponse } from "msw";

import type {
  KnowledgeItem,
  Category,
  User,
  Tag,
  CreateKnowledgeItemRequest,
  UpdateKnowledgeItemRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ApiResponse,
} from "../../types";

import {
  mockKnowledgeItems,
  mockCategories,
  mockTags,
  mockUser,
  generateId,
  getItemsByCategory,
  getCategoriesWithCounts,
} from "./fixtures";

// In-memory data store (persists during session)
const knowledgeItems = [...mockKnowledgeItems];
const categories = [...mockCategories];
const tags = [...mockTags];
const user = { ...mockUser };

// Simulate network delay
const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const handlers = [
  // Auth Endpoints
  http.post("/api/auth/login", async ({ request }) => {
    await delay();
    const body = (await request.json()) as { email: string; password: string };

    if (body.email === "demo@example.com" && body.password === "password") {
      return HttpResponse.json<ApiResponse<User>>({
        success: true,
        data: user,
        message: "Login successful",
      });
    }

    return HttpResponse.json(
      {
        error: "Invalid credentials",
        message: "Email or password is incorrect",
      },
      { status: 401 }
    );
  }),

  http.post("/api/auth/signup", async ({ request }) => {
    await delay();
    const body = (await request.json()) as {
      email: string;
      password: string;
      name?: string;
    };

    const newUser: User = {
      id: generateId(),
      email: body.email,
      name: body.name || "New User",
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

    return HttpResponse.json<ApiResponse<User>>({
      success: true,
      data: newUser,
      message: "Account created successfully",
    });
  }),

  http.post("/api/auth/logout", async () => {
    await delay(100);
    return HttpResponse.json<ApiResponse<null>>({
      success: true,
      data: null,
      message: "Logged out successfully",
    });
  }),

  http.get("/api/auth/user", async () => {
    await delay(200);
    return HttpResponse.json<ApiResponse<User>>({
      success: true,
      data: user,
    });
  }),

  // Knowledge Items Endpoints
  http.get("/api/knowledge", async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const query = url.searchParams.get("query");
    const contentType = url.searchParams.get("contentType");
    const categoryId = url.searchParams.get("categoryId");
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    let filteredItems = [...knowledgeItems];

    // Apply filters
    if (query) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.summary?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (contentType) {
      filteredItems = filteredItems.filter(
        (item) => item.contentType === contentType
      );
    }

    if (categoryId) {
      filteredItems = filteredItems.filter((item) =>
        item.categories?.includes(categoryId)
      );
    }

    // Apply sorting
    filteredItems.sort((a, b) => {
      const aValue = a[sortBy as keyof KnowledgeItem] as string | undefined;
      const bValue = b[sortBy as keyof KnowledgeItem] as string | undefined;
      const modifier = sortOrder === "desc" ? -1 : 1;

      if (!aValue && !bValue) return 0;
      if (!aValue) return 1 * modifier;
      if (!bValue) return -1 * modifier;
      if (aValue < bValue) return -1 * modifier;
      if (aValue > bValue) return 1 * modifier;
      return 0;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    if (query) {
      // Return search response format
      return HttpResponse.json({
        data: paginatedItems,
        query,
        total: filteredItems.length,
        took: Math.random() * 100, // fake search time
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
      });
    }

    return HttpResponse.json({
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total: filteredItems.length,
        totalPages: Math.ceil(filteredItems.length / limit),
        hasNext: endIndex < filteredItems.length,
        hasPrev: page > 1,
      },
    });
  }),

  http.get("/api/knowledge/:id", async ({ params }) => {
    await delay();
    const { id } = params;
    const item = knowledgeItems.find((item) => item.id === id);

    if (!item) {
      return HttpResponse.json(
        { error: "Not found", message: "Knowledge item not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json<ApiResponse<KnowledgeItem>>({
      success: true,
      data: item,
    });
  }),

  http.post("/api/knowledge", async ({ request }) => {
    await delay(800); // Simulate content processing time
    const body = (await request.json()) as CreateKnowledgeItemRequest;

    const newItem: KnowledgeItem = {
      id: generateId(),
      userId: user.id,
      title: body.title,
      contentType: body.contentType,
      sourceUrl: body.sourceUrl,
      originalContent: body.originalContent,
      summary: body.summary,
      keyPoints: body.keyPoints,
      metadata: body.metadata,
      categories: body.categoryIds,
      tags: body.tags,
      processedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    knowledgeItems.unshift(newItem);

    return HttpResponse.json<ApiResponse<KnowledgeItem>>({
      success: true,
      data: newItem,
      message: "Knowledge item created successfully",
    });
  }),

  http.put("/api/knowledge/:id", async ({ params, request }) => {
    await delay();
    const { id } = params;
    const body = (await request.json()) as UpdateKnowledgeItemRequest;

    const itemIndex = knowledgeItems.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return HttpResponse.json(
        { error: "Not found", message: "Knowledge item not found" },
        { status: 404 }
      );
    }

    const updatedItem = {
      ...knowledgeItems[itemIndex],
      ...body,
      categories: body.categoryIds,
      updatedAt: new Date().toISOString(),
    };

    knowledgeItems[itemIndex] = updatedItem;

    return HttpResponse.json<ApiResponse<KnowledgeItem>>({
      success: true,
      data: updatedItem,
      message: "Knowledge item updated successfully",
    });
  }),

  http.delete("/api/knowledge/:id", async ({ params }) => {
    await delay();
    const { id } = params;

    const itemIndex = knowledgeItems.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return HttpResponse.json(
        { error: "Not found", message: "Knowledge item not found" },
        { status: 404 }
      );
    }

    knowledgeItems.splice(itemIndex, 1);

    return HttpResponse.json<ApiResponse<null>>({
      success: true,
      data: null,
      message: "Knowledge item deleted successfully",
    });
  }),

  // Categories Endpoints
  http.get("/api/categories", async () => {
    await delay();
    const categoriesWithCounts = getCategoriesWithCounts();

    return HttpResponse.json<ApiResponse<Category[]>>({
      success: true,
      data: categoriesWithCounts,
    });
  }),

  http.get("/api/categories/tree", async () => {
    await delay();
    // Build hierarchical tree structure
    const buildTree = (parentId?: string): Category[] => {
      return categories
        .filter((cat) => cat.parentId === parentId)
        .map((cat) => ({
          ...cat,
          children: buildTree(cat.id),
          itemCount: getItemsByCategory(cat.id).length,
        }));
    };

    const tree = buildTree();

    return HttpResponse.json<ApiResponse<Category[]>>({
      success: true,
      data: tree,
    });
  }),

  http.post("/api/categories", async ({ request }) => {
    await delay();
    const body = (await request.json()) as CreateCategoryRequest;

    const newCategory: Category = {
      id: generateId(),
      userId: user.id,
      name: body.name,
      description: body.description,
      parentId: body.parentId,
      color: body.color || "#3B82F6",
      icon: body.icon || "folder",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      itemCount: 0,
    };

    categories.push(newCategory);

    return HttpResponse.json<ApiResponse<Category>>({
      success: true,
      data: newCategory,
      message: "Category created successfully",
    });
  }),

  http.put("/api/categories/:id", async ({ params, request }) => {
    await delay();
    const { id } = params;
    const body = (await request.json()) as UpdateCategoryRequest;

    const categoryIndex = categories.findIndex((cat) => cat.id === id);
    if (categoryIndex === -1) {
      return HttpResponse.json(
        { error: "Not found", message: "Category not found" },
        { status: 404 }
      );
    }

    const updatedCategory = {
      ...categories[categoryIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    categories[categoryIndex] = updatedCategory;

    return HttpResponse.json<ApiResponse<Category>>({
      success: true,
      data: updatedCategory,
      message: "Category updated successfully",
    });
  }),

  http.delete("/api/categories/:id", async ({ params }) => {
    await delay();
    const { id } = params;

    const categoryIndex = categories.findIndex((cat) => cat.id === id);
    if (categoryIndex === -1) {
      return HttpResponse.json(
        { error: "Not found", message: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has children
    const hasChildren = categories.some((cat) => cat.parentId === id);
    if (hasChildren) {
      return HttpResponse.json(
        {
          error: "Bad request",
          message: "Cannot delete category with subcategories",
        },
        { status: 400 }
      );
    }

    categories.splice(categoryIndex, 1);

    return HttpResponse.json<ApiResponse<null>>({
      success: true,
      data: null,
      message: "Category deleted successfully",
    });
  }),

  // Tags Endpoints
  http.get("/api/tags", async () => {
    await delay();
    return HttpResponse.json<ApiResponse<Tag[]>>({
      success: true,
      data: tags,
    });
  }),

  http.post("/api/tags", async ({ request }) => {
    await delay();
    const body = (await request.json()) as { name: string };

    // Check if tag already exists
    const existingTag = tags.find(
      (tag) => tag.name.toLowerCase() === body.name.toLowerCase()
    );
    if (existingTag) {
      return HttpResponse.json<ApiResponse<Tag>>({
        success: true,
        data: existingTag,
      });
    }

    const newTag: Tag = {
      id: generateId(),
      userId: user.id,
      name: body.name,
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };

    tags.push(newTag);

    return HttpResponse.json<ApiResponse<Tag>>({
      success: true,
      data: newTag,
      message: "Tag created successfully",
    });
  }),
];
