"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Clock, CheckCircle, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MobileNav } from "@/components/mobile-nav";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface Order {
  id: number;
  items: any[];
  total: number;
  paymentMethod: string;
  status: "received" | "preparing" | "ready" | "collected";
  createdAt: string;
}

const statusConfig = {
  received: { label: "Order Received", icon: CheckCircle, color: "text-primary", progress: 25 },
  preparing: { label: "Preparing", icon: Package, color: "text-secondary", progress: 50 },
  ready: { label: "Ready to Collect", icon: ShoppingBag, color: "text-accent", progress: 75 },
  collected: { label: "Collected", icon: CheckCircle, color: "text-green-600", progress: 100 },
};

export default function OrdersPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user) return;

      try {
        const token = localStorage.getItem("bearer_token");
        const response = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        setOrders(data.orders || []);

        if (orderId) {
          const order = data.orders.find((o: Order) => o.id === parseInt(orderId));
          if (order) {
            setActiveOrder(order);
          }
        }
      } catch (error) {
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchOrders();
    }
  }, [session, orderId]);

  // Auto-refresh orders every 10 seconds for live updates
  useEffect(() => {
    if (!session?.user) return;

    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem("bearer_token");
        const response = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        setOrders(data.orders || []);

        if (orderId && activeOrder) {
          const updatedOrder = data.orders.find((o: Order) => o.id === parseInt(orderId));
          if (updatedOrder) {
            setActiveOrder(updatedOrder);
          }
        }
      } catch (error) {
        // Silently fail for background updates
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [session, orderId, activeOrder]);

  if (isPending || isLoading) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pb-24">
          <main className="max-w-lg mx-auto px-4 py-12">
            <Card className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading orders...</p>
            </Card>
          </main>
        </div>
        <MobileNav />
      </>
    );
  }

  if (!session?.user) {
    return null;
  }

  // Show active order tracking if orderId is present
  if (activeOrder) {
    const config = statusConfig[activeOrder.status];
    const StatusIcon = config.icon;
    const estimatedTime = activeOrder.status === "collected" ? 0 : 15 - Math.floor((config.progress / 100) * 15);

    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pb-24">
          <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-40">
            <div className="max-w-lg mx-auto px-4 py-4">
              <div className="flex items-center gap-3">
                <Link href="/orders">
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold">Order Tracking</h1>
              </div>
            </div>
          </header>

          <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
            {/* Order Status Card */}
            <Card className="p-6 text-center space-y-6">
              <div className={`w-20 h-20 mx-auto rounded-full ${config.color} bg-current/10 flex items-center justify-center`}>
                <StatusIcon className={`h-10 w-10 ${config.color}`} />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">{config.label}</h2>
                <p className="text-muted-foreground">Order ID: #{activeOrder.id}</p>
              </div>

              {activeOrder.status !== "collected" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Estimated time: {estimatedTime} mins</span>
                  </div>
                  <Progress value={config.progress} className="h-2" />
                </div>
              )}
            </Card>

            {/* Order Timeline */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Order Status</h3>
              <div className="space-y-4">
                {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => {
                  const stepConfig = statusConfig[status];
                  const StepIcon = stepConfig.icon;
                  const isCompleted = config.progress >= stepConfig.progress;
                  const isCurrent = activeOrder.status === status;

                  return (
                    <div key={status} className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? isCurrent
                              ? `${stepConfig.color} bg-current/20`
                              : "bg-green-100 text-green-600"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <StepIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${isCompleted ? "" : "text-muted-foreground"}`}>
                          {stepConfig.label}
                        </div>
                        {isCurrent && (
                          <div className="text-xs text-primary">In progress...</div>
                        )}
                      </div>
                      {isCompleted && !isCurrent && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Order Items */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-3">
                {activeOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-border flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{activeOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {activeOrder.status === "ready" && (
              <Card className="p-6 bg-accent/10 border-accent">
                <h3 className="font-semibold mb-2 text-accent">🎉 Your order is ready!</h3>
                <p className="text-sm text-muted-foreground">
                  Please collect your order from the canteen counter.
                </p>
              </Card>
            )}
          </main>
        </div>
        <MobileNav />
      </>
    );
  }

  // Show order history
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
              <h1 className="text-2xl font-bold">Orders</h1>
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
          {orders.length === 0 ? (
            <Card className="p-12 text-center space-y-4">
              <div className="text-6xl">📦</div>
              <h2 className="text-2xl font-bold">No orders yet</h2>
              <p className="text-muted-foreground">Place your first order from the menu!</p>
              <Link href="/menu">
                <Button size="lg" className="mt-4">Browse Menu</Button>
              </Link>
            </Card>
          ) : (
            orders.slice().reverse().map((order) => {
              const config = statusConfig[order.status];
              return (
                <Link key={order.id} href={`/orders?orderId=${order.id}`}>
                  <Card className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={order.status === "collected" ? "default" : "secondary"}>
                        {config.label}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} item(s)
                      </p>
                      <span className="font-bold">₹{order.total.toFixed(2)}</span>
                    </div>
                  </Card>
                </Link>
              );
            })
          )}
        </main>
      </div>
      <MobileNav />
    </>
  );
}