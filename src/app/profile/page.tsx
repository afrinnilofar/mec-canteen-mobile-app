"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, User as UserIcon, Mail, Phone, Heart, Moon, Sun, Bell, LogOut, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MobileNav } from "@/components/mobile-nav";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleLogout = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      toast.success("Logged out successfully");
      router.push("/");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    toast.info(isDarkMode ? "Light mode enabled" : "Dark mode enabled");
  };

  if (isPending) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pb-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
        <MobileNav />
      </>
    );
  }

  if (!session?.user) return null;

  // Mock favorites
  const favorites = [
    { id: "b1", name: "Masala Dosa", price: 60, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop" },
    { id: "l2", name: "Chicken Biryani", price: 150, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop" },
    { id: "d1", name: "Butter Chicken", price: 140, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop" },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pb-24">
        <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-40">
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Profile</h1>
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
          {/* User Info */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={session.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {session.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{session.user.name}</h2>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
              </div>
              <Button variant="outline" size="icon" className="rounded-xl">
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{session.user.email}</span>
              </div>
            </div>
          </Card>

          {/* Favorites */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-destructive fill-destructive" />
              <h3 className="font-semibold text-lg">Favorite Items</h3>
            </div>
            <div className="grid gap-3">
              {favorites.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground">₹{item.price}</div>
                  </div>
                  <Heart className="h-5 w-5 text-destructive fill-destructive" />
                </div>
              ))}
            </div>
          </Card>

          {/* Settings */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Moon className="h-5 w-5 text-primary" />
                  ) : (
                    <Sun className="h-5 w-5 text-amber-500" />
                  )}
                  <div>
                    <Label className="font-medium">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">Toggle dark theme</p>
                  </div>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-secondary" />
                  <div>
                    <Label className="font-medium">Notifications</Label>
                    <p className="text-xs text-muted-foreground">Order status updates</p>
                  </div>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
            </div>
          </Card>

          {/* Order History Link */}
          <Link href="/orders">
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <span className="text-xl">📦</span>
                  </div>
                  <div>
                    <div className="font-medium">Order History</div>
                    <div className="text-xs text-muted-foreground">View all your orders</div>
                  </div>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180 text-muted-foreground" />
              </div>
            </Card>
          </Link>

          {/* Logout Button */}
          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </main>
      </div>
      <MobileNav />
    </>
  );
}