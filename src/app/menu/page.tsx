"use client";

import { useState } from "react";
import { ArrowLeft, Search, Plus, Minus, Leaf, Clock, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MobileNav } from "@/components/mobile-nav";
import { menuItems, categories } from "@/lib/data/menu";
import { useCart } from "@/lib/contexts/cart-context";
import { toast } from "sonner";
import Image from "next/image";

export default function MenuPage() {
  const { cart, addToCart, updateQuantity } = useCart();
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner">("breakfast");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = menuItems.filter((item) => {
    const matchesMealType = item.mealType === selectedMealType;
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMealType && matchesCategory && matchesSearch;
  });

  const getItemQuantity = (itemId: string) => {
    return cart.find((item) => item.id === itemId)?.quantity || 0;
  };

  const handleAddToCart = (item: typeof menuItems[0]) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  const handleIncrement = (itemId: string) => {
    const quantity = getItemQuantity(itemId);
    updateQuantity(itemId, quantity + 1);
  };

  const handleDecrement = (itemId: string) => {
    const quantity = getItemQuantity(itemId);
    if (quantity > 0) {
      updateQuantity(itemId, quantity - 1);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pb-24">
        {/* Header */}
        <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-40">
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Menu</h1>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
          {/* Meal Type Tabs */}
          <Tabs value={selectedMealType} onValueChange={(v) => setSelectedMealType(v as any)}>
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="breakfast" className="text-base">Breakfast</TabsTrigger>
              <TabsTrigger value="lunch" className="text-base">Lunch</TabsTrigger>
              <TabsTrigger value="dinner" className="text-base">Dinner</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap text-sm py-2 px-4"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid gap-4">
            {filteredItems.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No items found</p>
              </Card>
            ) : (
              filteredItems.map((item) => {
                const quantity = getItemQuantity(item.id);
                return (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex gap-4 p-4">
                      {/* Image */}
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        {item.isVeg && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                            <Leaf className="h-3 w-3 text-green-600" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-base leading-tight">{item.name}</h3>
                          <span className="font-bold text-primary whitespace-nowrap">₹{item.price}</span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span>{item.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.prepTime}</span>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        {quantity === 0 ? (
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(item)}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                        ) : (
                          <div className="flex items-center justify-between bg-primary/10 rounded-lg p-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => handleDecrement(item.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-semibold text-primary">{quantity}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => handleIncrement(item.id)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </main>
      </div>
      <MobileNav />
    </>
  );
}
