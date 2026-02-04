"use client";

import { TreePine, Search, User, Plus, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement add knowledge item logic
    console.log("Add knowledge item");
    setIsAddFormOpen(false);
  };

  const navigationItems = [
    {
      id: "tree",
      label: "Tree",
      icon: TreePine,
      href: "/dashboard/tree",
    },
    {
      id: "search",
      label: "Search",
      icon: Search,
      href: "/dashboard/search",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/dashboard/profile",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-gray-50">
        {/* Header */}
        <header className="border-b bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-semibold text-gray-900">
              Tree of Knowledge
            </h1>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-gray-600 sm:block">
                {user?.name || user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 pb-20">{children}</main>

        {/* Floating Action Button */}
        <Sheet open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="fixed right-4 bottom-20 z-40 h-14 w-14 rounded-full shadow-lg transition-shadow hover:shadow-xl"
            >
              <Plus className="h-6 w-6" />
              <span className="sr-only">Add knowledge item</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
            <SheetHeader>
              <SheetTitle>Add Knowledge Item</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleAddSubmit} className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/article"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a title for this knowledge item"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description or summary"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="machine-learning, ai, tutorial (comma separated)"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Add Item
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddFormOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>

        {/* Bottom Navigation */}
        <nav className="fixed right-0 bottom-0 left-0 z-30 border-t border-gray-200 bg-white">
          <div className="grid h-16 grid-cols-3">
            {navigationItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/dashboard/tree" && pathname === "/dashboard");
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </ProtectedRoute>
  );
}
