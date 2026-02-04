"use client";

import { TreePine, Folder, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TreePage() {
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
                    <p className="text-xs text-gray-600">Organize by topics</p>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center">
                <Folder className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                <p className="text-sm font-medium text-gray-700">Technology</p>
                <p className="text-xs text-gray-500">0 items</p>
              </div>
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center">
                <Folder className="mx-auto mb-2 h-8 w-8 text-green-500" />
                <p className="text-sm font-medium text-gray-700">Science</p>
                <p className="text-xs text-gray-500">0 items</p>
              </div>
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center">
                <Folder className="mx-auto mb-2 h-8 w-8 text-purple-500" />
                <p className="text-sm font-medium text-gray-700">Business</p>
                <p className="text-xs text-gray-500">0 items</p>
              </div>
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center">
                <Folder className="mx-auto mb-2 h-8 w-8 text-orange-500" />
                <p className="text-sm font-medium text-gray-700">Personal</p>
                <p className="text-xs text-gray-500">0 items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-6 text-center">
              <p className="text-sm text-gray-500">
                Tags will appear here as you add knowledge items.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 opacity-50">
                <Badge variant="secondary">machine-learning</Badge>
                <Badge variant="secondary">tutorial</Badge>
                <Badge variant="secondary">beginner</Badge>
                <Badge variant="secondary">advanced</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
