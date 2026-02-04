"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect to tree page as the default dashboard view
  useEffect(() => {
    router.replace("/dashboard/tree");
  }, [router]);

  // Keep the content as fallback during redirect
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Hello {user?.name || user?.email?.split("@")[0]}! Your personal
              knowledge organization system is ready. Start adding content to
              build your tree of knowledge.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Knowledge Items</div>
              </div>
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
              <div className="rounded-lg bg-orange-50 p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-gray-600">Tags</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">
                No recent activity. Start by adding your first knowledge item
                using the + button below.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Add your first knowledge item
                  </p>
                  <p className="text-xs text-gray-600">
                    Click the + button to add an article, video, or other
                    content
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 opacity-60">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Organize with categories
                  </p>
                  <p className="text-xs text-gray-600">
                    Create categories to organize your knowledge
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 opacity-60">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Explore your knowledge tree
                  </p>
                  <p className="text-xs text-gray-600">
                    Visualize connections between your content
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
