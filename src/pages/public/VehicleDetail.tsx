import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
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
import { useVehicleStore } from "@/store/vehicleStore";
import { useAuctionStore } from "@/store/auctionStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/useToast";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVehicleById, showInterest } = useVehicleStore();
  const { getAuctionById } = useAuctionStore();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const { toast } = useToast();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const vehicle = getVehicleById(id!);
  const auction = vehicle ? getAuctionById(vehicle.auctionId) : null;

  if (!vehicle || !auction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Vehicle not found</p>
      </div>
    );
  }

  const isRegisteredBuyer = user && auction.registeredBuyers.includes(user.id);
  const hasShownInterest = user && vehicle.interestedBuyers.includes(user.id);
  const isInWishlist = user && user.wishlist?.includes(vehicle.id);

  const handleShowInterest = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!isRegisteredBuyer) {
      toast({
        title: "Registration Required",
        message: "Please register for the auction first to show interest",
        type: "info",
      });
      navigate(`/auctions/${auction.id}`);
      return;
    }
    showInterest(vehicle.id, user.id);
    if (user.interestedVehicles) {
      updateUser({
        interestedVehicles: [...user.interestedVehicles, vehicle.id],
      });
    }
    toast({
      title: "Interest Recorded!",
      message: "The seller will see your name and city.",
      type: "success",
    });
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isInWishlist) {
      const newWishlist = user.wishlist?.filter((v) => v !== vehicle.id) || [];
      updateUser({ wishlist: newWishlist });
      toast({
        title: "Removed from Wishlist",
        message: "Vehicle removed from your wishlist",
        type: "info",
      });
    } else {
      updateUser({ wishlist: [...(user.wishlist || []), vehicle.id] });
      toast({
        title: "Added to Wishlist",
        message: "Vehicle added to your wishlist",
        type: "success",
      });
    }
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % vehicle.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex(
      (prev) => (prev - 1 + vehicle.photos.length) % vehicle.photos.length,
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 fade-in-up">
      <Button
        asChild
        variant="link"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 p-0 h-auto"
      >
        <Link to="/vehicles">
          <ArrowLeft className="h-4 w-4" />
          Back to Vehicles
        </Link>
      </Button>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-6">
          {/* Photo Gallery */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-muted">
                <img
                  src={vehicle.photos[currentPhotoIndex]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=60";
                  }}
                />
                {vehicle.photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white transition-all hover:scale-110"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white transition-all hover:scale-110"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {vehicle.photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentPhotoIndex
                          ? "bg-white w-8"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 p-4 overflow-x-auto">
                {vehicle.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentPhotoIndex
                        ? "border-primary scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={photo}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=60";
                      }}
                    />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl md:text-4xl font-display mb-2">
                    {vehicle.make} {vehicle.model}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {vehicle.year} • {vehicle.type} • {vehicle.color}
                  </CardDescription>
                </div>
                <Badge className="capitalize text-base px-3 py-1 bg-white/90 text-black border-0">
                  {vehicle.condition}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Specs Grid */}
              <div>
                <h3 className="font-semibold font-display mb-4">
                  Specifications
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Gauge className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Odometer
                      </div>
                      <div className="font-semibold">
                        {vehicle.odometer.toLocaleString()} km
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Fuel className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Fuel Type
                      </div>
                      <div className="font-semibold">{vehicle.fuelType}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Transmission
                      </div>
                      <div className="font-semibold capitalize">
                        {vehicle.transmission}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Purchase Date
                      </div>
                      <div className="font-semibold">
                        {formatDate(vehicle.purchaseDate)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold font-display mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {vehicle.description}
                </p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold font-display mb-3">
                  Auction Details
                </h3>
                <Link
                  to={`/auctions/${auction.id}`}
                  className="block p-4 border-2 border-primary/20 rounded-lg hover:border-primary/50 transition-all hover:shadow-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-medium font-display">
                      {auction.title}
                    </div>
                    <Badge className="status-approved">{auction.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    {auction.city} • {auction.venue}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    {formatDate(auction.date)} at {auction.time}
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-20 border-primary/30 shadow-[0_0_40px_-8px_rgba(245,158,11,0.2)]">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground font-normal">
                Base Price
              </CardTitle>
              <div className="text-4xl font-display font-bold text-primary">
                {formatCurrency(vehicle.basePrice)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full gradient-gold text-black hover:opacity-90 font-semibold"
                size="lg"
                onClick={handleShowInterest}
                disabled={hasShownInterest || user?.role !== "buyer"}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${hasShownInterest ? "fill-current" : ""}`}
                />
                {hasShownInterest ? "Interest Recorded" : "Show Interest"}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleWishlist}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${isInWishlist ? "fill-current text-red-500" : ""}`}
                />
                {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
              </Button>

              {!isRegisteredBuyer && user?.role === "buyer" && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    Register for the auction to show interest
                  </p>
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    <Link to={`/auctions/${auction.id}`}>
                      Register for Auction
                    </Link>
                  </Button>
                </div>
              )}

              {!isAuthenticated && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    Login to show interest or add to wishlist
                  </p>
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-semibold">
                    {vehicle.interestedBuyers.length}
                  </span>
                  <span className="text-muted-foreground">
                    buyers interested
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t text-xs text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-primary" />
                  <span>Verified seller</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-primary" />
                  <span>Inspection allowed before auction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-primary" />
                  <span>Secure payment process</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
