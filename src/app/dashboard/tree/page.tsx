"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { TreePine, Folder, FileText } from "lucide-react";
import { useEffect, useState } from "react";

import { KnowledgeTree } from "@/components/KnowledgeTree";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/types/category";

export default function TreePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryTree = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/categories/tree");
        const result = await response.json();

        if (result.success) {
          setCategories(result.data);
        } else {
          setError("Failed to load categories");
        }
      } catch (err) {
        setError("Failed to fetch category tree");
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryTree();
  }, []);

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreePine className="h-5 w-5" />
              Knowledge Tree
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center">
                <TreePine className="mx-auto mb-4 h-16 w-16 animate-pulse text-gray-300" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Loading Your Knowledge Tree...
                </h3>
                <p className="mx-auto max-w-sm text-sm text-gray-600">
                  Organizing your categories and knowledge items
                </p>
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <TreePine className="mx-auto mb-4 h-16 w-16 text-red-300" />
                <h3 className="mb-2 text-lg font-semibold text-red-900">
                  Error Loading Tree
                </h3>
                <p className="mx-auto max-w-sm text-sm text-red-600">{error}</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="py-12 text-center">
                <TreePine className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Your Knowledge Tree Awaits
                </h3>
                <p className="mx-auto mb-6 max-w-sm text-sm text-gray-600">
                  Start adding knowledge items to see your personalized tree
                  visualization. Categories and connections will appear here.
                </p>
                <div className="mx-auto max-w-sm space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-left">
                    <Folder className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Categories</p>
                      <p className="text-xs text-gray-600">
                        Organize by topics
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-left">
                    <FileText className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Knowledge Items</p>
                      <p className="text-xs text-gray-600">
                        Articles, videos, notes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <ReactFlowProvider>
                  <KnowledgeTree categories={categories} />
                </ReactFlowProvider>
                <div className="text-center text-sm text-gray-600">
                  <p>
                    <strong>
                      {categories.reduce(
                        (total, cat) => total + (cat.itemCount || 0),
                        0
                      )}
                    </strong>{" "}
                    knowledge items across <strong>{categories.length}</strong>{" "}
                    categories
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Categories Overview */}
        {!isLoading && !error && categories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Category Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {categories.slice(0, 4).map((category) => (
                  <div
                    key={category.id}
                    className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center transition-colors hover:border-gray-300"
                  >
                    <Folder
                      className="mx-auto mb-2 h-8 w-8"
                      style={{ color: category.color || "#3B82F6" }}
                    />
                    <p className="text-sm font-medium text-gray-700">
                      {category.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {category.itemCount || 0} items
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Popular Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">#machine-learning</Badge>
              <Badge variant="secondary">#react</Badge>
              <Badge variant="secondary">#productivity</Badge>
              <Badge variant="secondary">#javascript</Badge>
              <Badge variant="secondary">#design</Badge>
              <Badge variant="secondary">#business</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
