"use client";

import { Search, Filter, Tag } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search logic
    console.log("Search for:", searchQuery);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        {/* Search Input */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search your knowledge..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
                <Button variant="outline" type="button">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-12 text-center">
              <Search className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Ready to Search
              </h3>
              <p className="mx-auto mb-6 max-w-sm text-sm text-gray-600">
                Start typing to search through your knowledge items. Results
                will appear here instantly.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  Content Type
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    Articles
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    Videos
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    Podcasts
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    Books
                  </Badge>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  Recent Searches
                </h4>
                <div className="space-y-2">
                  <div className="py-4 text-center">
                    <p className="text-sm text-gray-500">
                      Your recent searches will appear here.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Popular Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-6 text-center">
              <p className="mb-4 text-sm text-gray-500">
                Popular tags will appear here as you build your knowledge base.
              </p>
              <div className="flex flex-wrap justify-center gap-2 opacity-50">
                <Badge variant="secondary" className="cursor-pointer">
                  machine-learning
                </Badge>
                <Badge variant="secondary" className="cursor-pointer">
                  tutorial
                </Badge>
                <Badge variant="secondary" className="cursor-pointer">
                  javascript
                </Badge>
                <Badge variant="secondary" className="cursor-pointer">
                  productivity
                </Badge>
                <Badge variant="secondary" className="cursor-pointer">
                  design
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Search Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-xs font-medium text-blue-600">💡</span>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Use quotes for exact phrases
                  </p>
                  <p className="text-xs text-gray-600">
                    machine learning basics
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                  <span className="text-xs font-medium text-green-600">🏷️</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Search by tags</p>
                  <p className="text-xs text-gray-600">
                    tag:tutorial tag:beginner
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                  <span className="text-xs font-medium text-purple-600">
                    📁
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">Filter by category</p>
                  <p className="text-xs text-gray-600">category:technology</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
