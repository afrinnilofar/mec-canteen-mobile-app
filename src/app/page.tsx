"use client";

import Link from "next/link";
import { UtensilsCrossed, Clock, CreditCard, Bell, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MobileNav } from "@/components/mobile-nav";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const { data: session } = useSession();

  const features = [
    {
      icon: UtensilsCrossed,
      title: "Wide Menu",
      description: "Browse breakfast, lunch & dinner options",
      color: "text-primary"
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Track your order from kitchen to counter",
      color: "text-secondary"
    },
    {
      icon: CreditCard,
      title: "Digital Payment",
      description: "Pay easily with UPI or cards",
      color: "text-accent"
    },
    {
      icon: Bell,
      title: "Instant Updates",
      description: "Get notified when order is ready",
      color: "text-chart-4"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pb-20 md:pb-8">
        {/* Header */}
        <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-40">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <UtensilsCrossed className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Campus Canteen
                </h1>
                <p className="text-xs text-muted-foreground">Order food instantly</p>
              </div>
            </div>
            {!session?.user && (
              <Link href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
            )}
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-8">
          {/* Hero Section */}
          <section className="text-center space-y-4 py-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Skip the queue, order online!</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Delicious Food,{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Zero Wait
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Order your favorite meals from the college canteen and get real-time updates when it's ready to collect.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link href="/menu" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base font-semibold shadow-lg shadow-primary/30">
                  Browse Menu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!session?.user && (
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-semibold">
                    Sign Up Free
                  </Button>
                </Link>
              )}
            </div>
          </section>

          {/* Features Grid */}
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-center">Why Choose Us?</h3>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="p-5 space-y-3 hover:shadow-lg transition-shadow border-2">
                    <div className={`w-12 h-12 rounded-2xl ${feature.color} bg-current/10 flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Quick Stats */}
          <section className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-6 text-white">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold mb-1">50+</div>
                <div className="text-xs opacity-90">Menu Items</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">15min</div>
                <div className="text-xs opacity-90">Avg. Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">1000+</div>
                <div className="text-xs opacity-90">Happy Students</div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center space-y-4 py-8">
            <h3 className="text-2xl font-bold">Ready to Order?</h3>
            <p className="text-muted-foreground">
              Start browsing our delicious menu and place your first order today!
            </p>
            <Link href="/menu">
              <Button size="lg" className="shadow-lg">
                Explore Menu
              </Button>
            </Link>
          </section>
        </main>
      </div>
      <MobileNav />
    </>
  );
}