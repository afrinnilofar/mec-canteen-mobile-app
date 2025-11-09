"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Plus, Minus, Tag, CreditCard, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { MobileNav } from "@/components/mobile-nav";
import { useCart } from "@/lib/contexts/cart-context";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { data: session, isPending } = useSession();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
    }
  }, [session, isPending, router]);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "STUDENT10") {
      const discountAmount = subtotal * 0.1;
      setDiscount(discountAmount);
      toast.success("Promo code applied! 10% off");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handlePlaceOrder = async () => {
    if (!session) {
      toast.error("Please login to place order");
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const token = localStorage.getItem("bearer_token");
      
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal,
        tax,
        discount,
        total,
        paymentMethod,
        promoCode: promoCode || undefined
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create order");
      }

      const order = await response.json();

      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/order-confirmation?orderId=${order.id}`);
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
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

  if (cart.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pb-24">
          <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-40">
            <div className="max-w-lg mx-auto px-4 py-4">
              <div className="flex items-center gap-3">
                <Link href="/menu">
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold">Cart</h1>
              </div>
            </div>
          </header>

          <main className="max-w-lg mx-auto px-4 py-12">
            <Card className="p-12 text-center space-y-4">
              <div className="text-6xl">🛒</div>
              <h2 className="text-2xl font-bold">Your cart is empty</h2>
              <p className="text-muted-foreground">Add some delicious items from the menu!</p>
              <Link href="/menu">
                <Button size="lg" className="mt-4">Browse Menu</Button>
              </Link>
            </Card>
          </main>
        </div>
        <MobileNav />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pb-24">
        <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-40">
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Link href="/menu">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Cart ({cart.length})</h1>
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
          {/* Cart Items */}
          <div className="space-y-3">
            {cart.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">₹{item.price}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-muted rounded-lg">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-3 font-semibold">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Promo Code */}
          <Card className="p-4">
            <Label className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Apply Promo Code
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Enter code (try STUDENT10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <Button onClick={handleApplyPromo}>Apply</Button>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-4">
            <Label className="text-sm font-semibold mb-3 block">Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">UPI</div>
                    <div className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5 text-secondary" />
                  <div>
                    <div className="font-medium">Card</div>
                    <div className="text-xs text-muted-foreground">Credit or Debit Card</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </Card>

          {/* Bill Summary */}
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold text-lg mb-3">Bill Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Place Order Button */}
          <Button 
            size="lg" 
            className="w-full" 
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? "Placing Order..." : `Place Order · ₹${total.toFixed(2)}`}
          </Button>
        </main>
      </div>
      <MobileNav />
    </>
  );
}