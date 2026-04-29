import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuctionStore } from "@/store/auctionStore";
import { useVehicleStore } from "@/store/vehicleStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/useToast";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useState } from "react";
import CheckoutModal from "@/components/shared/CheckoutModal";

export default function AuctionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuctionById } = useAuctionStore();
  const { getVehiclesByAuction } = useVehicleStore();
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutRole, setCheckoutRole] = useState<"buyer" | "seller">("buyer");

  const auction = getAuctionById(id!);
  const vehicles = getVehiclesByAuction(id!);

  if (!auction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Auction not found</p>
      </div>
    );
  }

  const isRegisteredBuyer = user && auction.registeredBuyers.includes(user.id);
  const isRegisteredSeller =
    user && auction.registeredSellers.includes(user.id);

  const handleRegister = (role: "buyer" | "seller") => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setCheckoutRole(role);
    setShowCheckout(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "live":
        return "status-live";
      case "approved":
        return "status-approved";
      case "completed":
        return "status-completed";
      default:
        return "";
    }
  };

  return (
    <div className="fade-in-up">
      {/* Hero Banner */}
      <section className="bg-[#0f0f0f] hero-pattern py-12 px-4 mb-8">
        <div className="container mx-auto">
          <Button
            asChild
            variant="link"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-6 p-0 h-auto"
          >
            <Link to="/auctions">
              <ArrowLeft className="h-4 w-4" />
              Back to Auctions
            </Link>
          </Button>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge className={getStatusBadgeClass(auction.status)}>
                  {auction.status}
                </Badge>
                <span className="text-sm text-white/60">
                  {auction.vehicleCount}/{auction.vehicleLimit} vehicles
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
                {auction.title}
              </h1>
              <p className="text-lg text-white/70 max-w-2xl">
                {auction.description}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="text-center px-4 py-2 bg-white/10 rounded-lg backdrop-blur">
                <MapPin className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-sm text-white font-medium">
                  {auction.city}
                </div>
              </div>
              <div className="text-center px-4 py-2 bg-white/10 rounded-lg backdrop-blur">
                <Calendar className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-sm text-white font-medium">
                  {formatDate(auction.date)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Auction Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Auction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Venue
                      </div>
                      <div className="font-medium">{auction.venue}</div>
                      <div className="text-sm text-muted-foreground">
                        {auction.address}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {auction.city}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Date & Time
                      </div>
                      <div className="font-medium">
                        {formatDate(auction.date)}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {auction.time}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3 font-display">
                    Auction Rules & Policies
                  </h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {auction.rules}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">
                          {auction.registeredBuyers.length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Buyers Registered
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">
                          {auction.registeredSellers.length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Sellers Registered
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicles Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display">
                  <Car className="h-5 w-5" />
                  Vehicles in this Auction ({vehicles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vehicles.length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="h-16 w-16 text-primary/20 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No vehicles listed yet
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {vehicles.map((vehicle) => (
                      <Link key={vehicle.id} to={`/vehicles/${vehicle.id}`}>
                        <Card className="card-hover overflow-hidden">
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={vehicle.photos[0]}
                              alt={`${vehicle.make} ${vehicle.model}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=60";
                              }}
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                            <Badge className="absolute top-2 left-2 gradient-gold text-black border-0">
                              {vehicle.category.replace("_", "-")}
                            </Badge>
                            <Badge className="absolute top-2 right-2 bg-white/90 text-black border-0 capitalize">
                              {vehicle.condition}
                            </Badge>
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-display">
                              {vehicle.make} {vehicle.model}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {vehicle.year} •{" "}
                              {vehicle.odometer.toLocaleString()} km
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center">
                              <span className="text-xl font-display font-bold text-primary">
                                {formatCurrency(vehicle.basePrice)}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Registration */}
          <div className="space-y-4">
            <Card className="sticky top-20 border-primary/30 shadow-[0_0_40px_-8px_rgba(245,158,11,0.2)]">
              <CardHeader>
                <CardTitle className="font-display">Registration</CardTitle>
                <CardDescription>
                  Choose your role to participate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Buyer Registration */}
                <div className="p-4 border-2 border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold mb-1">
                        Buyer Registration
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Attend and bid on vehicles
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-display font-bold text-primary mb-3">
                    {formatCurrency(auction.buyerFee)}
                  </div>
                  {isRegisteredBuyer ? (
                    <div className="flex items-center justify-center gap-2 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Registered</span>
                    </div>
                  ) : (
                    <Button
                      className="w-full gradient-gold text-black hover:opacity-90"
                      onClick={() => handleRegister("buyer")}
                      disabled={
                        user?.role === "seller" || user?.role === "vendor"
                      }
                    >
                      Register as Buyer
                    </Button>
                  )}
                </div>

                {/* Seller Registration */}
                <div className="p-4 border-2 border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold mb-1">
                        Seller Registration
                      </div>
                      <div className="text-xs text-muted-foreground">
                        List your vehicle
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-display font-bold text-primary mb-3">
                    {formatCurrency(auction.sellerFee)}
                  </div>
                  {isRegisteredSeller ? (
                    <div className="flex items-center justify-center gap-2 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Registered</span>
                    </div>
                  ) : (
                    <Button
                      className="w-full gradient-gold text-black hover:opacity-90"
                      onClick={() => handleRegister("seller")}
                      disabled={
                        user?.role === "buyer" || user?.role === "vendor"
                      }
                    >
                      Register as Seller
                    </Button>
                  )}
                </div>

                <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-primary" />
                    <span>Secure payment via Razorpay</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-primary" />
                    <span>Digital ticket with QR code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-primary" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          auctionId={auction.id}
          role={checkoutRole}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            toast({
              title: "Registration Successful!",
              message: "Check your dashboard for your ticket.",
              type: "success",
            });
            setShowCheckout(false);
          }}
        />
      )}
    </div>
  );
}
