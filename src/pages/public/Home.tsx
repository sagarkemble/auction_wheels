import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Car,
  Gavel,
  Shield,
  TrendingUp,
  Calendar,
  MapPin,
  Heart,
  CheckCircle,
  ArrowRight,
  Users,
  Clock,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuctionStore } from "@/store/auctionStore";
import { useVehicleStore } from "@/store/vehicleStore";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function Home() {
  const { auctions } = useAuctionStore();
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);
  const { vehicles } = useVehicleStore();

  const featuredAuctions = auctions
    .filter((a) => a.status === "approved" || a.status === "live")
    .slice(0, 3);
  const featuredVehicles = vehicles.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-black focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Hero Section */}
      <section
        className="relative bg-background hero-pattern min-h-screen flex flex-col justify-center overflow-hidden"
        aria-label="Hero section"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-primary/8 rounded-full blur-2xl" />
        </div>

        <div className="grid lg:grid-cols-2 gap-0 items-stretch min-h-screen">
          {/* Left Column */}
          <div className="flex flex-col justify-center px-4 lg:pl-16 xl:pl-24 py-24 lg:py-0">
            <div className="flex items-center gap-3 mb-6 fade-in-up">
              <div className="w-10 h-px bg-primary" />
              <span className="text-primary text-xs font-medium tracking-[0.2em] uppercase font-display">
                India's #1 Vehicle Auction Platform
              </span>
            </div>

            <h1 className="font-display mb-6 fade-in-up">
              <div className="text-foreground text-5xl md:text-6xl xl:text-7xl font-bold leading-tight">
                Find Your Next
              </div>
              <div className="text-gradient-gold text-5xl md:text-6xl xl:text-7xl font-bold leading-tight italic">
                Dream Vehicle.
              </div>
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-8 fade-in-up">
              Browse verified vehicle auctions across India. Register online,
              attend offline, drive away.
            </p>

            <div className="flex flex-wrap gap-4 mb-10 fade-in-up">
              <Button
                asChild
                className="gradient-gold text-black font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                aria-label="Browse all vehicle auctions"
              >
                <Link to="/auctions">
                  Browse Auctions
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                className="border border-border text-foreground bg-transparent hover:bg-muted hover:border-primary px-8 py-3 rounded-xl transition-all duration-200 cursor-pointer"
                aria-label="Register as a seller"
              >
                <Link to="/register">Become a Seller</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 fade-in-up">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Verified Sellers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Razorpay Secured
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  500+ Happy Buyers
                </span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="hidden lg:flex items-stretch relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80"
              className="w-full h-full object-cover object-center"
              alt="Luxury sports car showcasing premium vehicles available at Auction Wheels"
            />
            <div
              className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-background to-transparent pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-12 left-1/4 w-48 h-48 bg-primary/15 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div
              className="absolute top-8 left-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-border rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2 fade-in-up"
              role="status"
              aria-live="polite"
            >
              <Car className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {vehicles.length}+ Vehicles Listed
              </span>
            </div>

            <div
              className="absolute bottom-8 right-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-border rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2 fade-in-up"
              role="status"
              aria-live="polite"
            >
              <div
                className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {featuredAuctions.length} Live Auctions
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* City Marquee */}
      <div className="bg-muted border-t border-border/30 py-3 overflow-hidden">
        <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {[
            "MUMBAI",
            "DELHI",
            "BANGALORE",
            "PUNE",
            "HYDERABAD",
            "CHENNAI",
            "AHMEDABAD",
            "KOLKATA",
          ].map((city, i) => (
            <span
              key={i}
              className="text-primary/40 text-xs tracking-[0.25em] uppercase mx-6 font-display"
            >
              {city} &nbsp;•
            </span>
          ))}
          {[
            "MUMBAI",
            "DELHI",
            "BANGALORE",
            "PUNE",
            "HYDERABAD",
            "CHENNAI",
            "AHMEDABAD",
            "KOLKATA",
          ].map((city, i) => (
            <span
              key={`dup-${i}`}
              className="text-primary/40 text-xs tracking-[0.25em] uppercase mx-6 font-display"
            >
              {city} &nbsp;•
            </span>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <section
        id="main-content"
        className="bg-muted border-y border-border"
        aria-label="Platform statistics"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {/* Stat 1 */}
            <div className="p-6 lg:p-8 flex items-center gap-4 border-b md:border-b-0 border-r border-border transition-colors duration-300 hover:bg-accent group">
              <div
                className="w-[48px] h-[48px] rounded-[10px] bg-primary/10 border border-border flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:border-primary"
                aria-hidden="true"
              >
                <Gavel className="h-[22px] w-[22px] text-primary transition-colors duration-300" />
              </div>
              <div className="flex flex-col">
                <div
                  className="text-[26px] font-bold font-display leading-none text-foreground"
                  aria-label={`${auctions.length} plus auctions`}
                >
                  {auctions.length}<span className="text-primary">+</span>
                </div>
                <div className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground mt-1">
                  Auctions
                </div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="p-6 lg:p-8 flex items-center gap-4 border-b md:border-b-0 md:border-r border-border transition-colors duration-300 hover:bg-accent group">
              <div
                className="w-[48px] h-[48px] rounded-[10px] bg-primary/10 border border-border flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:border-primary"
                aria-hidden="true"
              >
                <Car className="h-[22px] w-[22px] text-primary transition-colors duration-300" />
              </div>
              <div className="flex flex-col">
                <div
                  className="text-[26px] font-bold font-display leading-none text-foreground"
                  aria-label={`${vehicles.length} plus vehicles listed`}
                >
                  {vehicles.length}<span className="text-primary">+</span>
                </div>
                <div className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground mt-1">
                  Vehicles Listed
                </div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="p-6 lg:p-8 flex items-center gap-4 border-r border-border transition-colors duration-300 hover:bg-accent group">
              <div
                className="w-[48px] h-[48px] rounded-[10px] bg-primary/10 border border-border flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:border-primary"
                aria-hidden="true"
              >
                <Users className="h-[22px] w-[22px] text-primary transition-colors duration-300" />
              </div>
              <div className="flex flex-col">
                <div
                  className="text-[26px] font-bold font-display leading-none text-foreground"
                  aria-label="500 plus happy buyers"
                >
                  500<span className="text-primary">+</span>
                </div>
                <div className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground mt-1">
                  Happy Buyers
                </div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="p-6 lg:p-8 flex items-center gap-4 transition-colors duration-300 hover:bg-accent group">
              <div
                className="w-[48px] h-[48px] rounded-[10px] bg-primary/10 border border-border flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:border-primary"
                aria-hidden="true"
              >
                <Globe className="h-[22px] w-[22px] text-primary transition-colors duration-300" />
              </div>
              <div className="flex flex-col">
                <div
                  className="text-[26px] font-bold font-display leading-none text-foreground"
                  aria-label="10 cities"
                >
                  10
                </div>
                <div className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground mt-1">
                  Cities
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section
        className="py-16 px-4"
        aria-labelledby="featured-auctions-heading"
      >
        <div className="container mx-auto fade-in-up">
          <div className="mb-10">
            <div className="flex items-end gap-4 mb-3">
              <h2
                id="featured-auctions-heading"
                className="text-3xl md:text-4xl font-display font-bold"
              >
                Upcoming <span className="text-primary">Auctions</span>
              </h2>
              <div
                className="flex items-center gap-1.5 mb-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full"
                role="status"
                aria-live="polite"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
                  aria-hidden="true"
                />
                Live & Approved
              </div>
            </div>
            <p className="text-muted-foreground">
              Don't miss these exciting opportunities
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredAuctions.map((auction) => (
              <Card key={auction.id} className="card-hover overflow-hidden">
                <div className="h-2 gradient-gold"></div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="line-clamp-1 font-display">
                      {auction.title}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="border-primary text-primary shrink-0"
                    >
                      {auction.city}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {auction.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(auction.date)} at {auction.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{auction.venue}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Vehicles</span>
                        <span className="font-medium">
                          {auction.vehicleCount}/{auction.vehicleLimit}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="gradient-gold h-2 rounded-full transition-all"
                          style={{
                            width: `${(auction.vehicleCount / auction.vehicleLimit) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Buyer Fee</span>
                      <span className="font-semibold text-primary font-display">
                        {formatCurrency(auction.buyerFee)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seller Fee</span>
                      <span className="font-semibold text-primary font-display">
                        {formatCurrency(auction.sellerFee)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-primary font-medium mb-3">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      Starts in{" "}
                      {Math.max(
                        0,
                        Math.ceil(
                          (new Date(auction.date).getTime() - now) /
                            (1000 * 60 * 60 * 24),
                        ),
                      )}
                      d
                    </span>
                  </div>
                  <Button
                    asChild
                    className="w-full gradient-gold text-black font-semibold hover:opacity-90 cursor-pointer"
                    aria-label={`View details for ${auction.title}`}
                  >
                    <Link to={`/auctions/${auction.id}`}>View Auction</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section
        className="py-16 px-4 bg-muted/20 border-t border-border"
        aria-labelledby="featured-vehicles-heading"
      >
        <div className="container mx-auto fade-in-up">
          <div className="mb-10">
            <h2
              id="featured-vehicles-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              Featured <span className="text-primary">Vehicles</span>
            </h2>
            <p className="text-muted-foreground">
              Handpicked vehicles from our auctions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.map((vehicle) => {
              const conditionStyles = {
                excellent: "bg-green-500/90 text-white",
                good: "bg-yellow-500/90 text-black",
                fair: "bg-orange-500/90 text-white",
                poor: "bg-red-500/90 text-white",
              };
              return (
                <Card
                  key={vehicle.id}
                  className="card-hover overflow-hidden group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={vehicle.photos[0]}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=60";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <Badge className="absolute top-3 left-3 gradient-gold text-black border-0">
                      {vehicle.category.replace("_", "-")}
                    </Badge>
                    <Badge
                      className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-lg border-0 capitalize ${conditionStyles[vehicle.condition as keyof typeof conditionStyles] || "bg-white/90 text-black"}`}
                    >
                      {vehicle.condition}
                    </Badge>
                    <button className="absolute top-3 left-3 z-10 bg-card/70 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-display">
                      {vehicle.make} {vehicle.model}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {vehicle.year} • {vehicle.odometer.toLocaleString()} km
                    </CardDescription>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Gavel className="h-3 w-3" />
                      <span>
                        {auctions.find((a) => a.id === vehicle.auctionId)
                          ?.title || "Upcoming Auction"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-display font-bold text-primary">
                        {formatCurrency(vehicle.basePrice)}
                      </span>
                    </div>
                    <Button asChild className="w-full gradient-gold text-black font-semibold hover:opacity-90 cursor-pointer" size="sm">
                      <Link to={`/vehicles/${vehicle.id}`} className="flex items-center justify-center gap-2">
                        View Details
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className="py-20 px-4 bg-muted/30 relative border-t border-border"
        aria-labelledby="how-it-works-heading"
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(38 92% 50% / 0.15) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container mx-auto fade-in-up relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-display mb-2">
              PROCESS
            </p>
            <h2
              id="how-it-works-heading"
              className="text-4xl md:text-5xl font-bold text-foreground tracking-tight font-display"
            >
              How It{" "}
              <span className="text-primary relative inline-block">
                Works
                <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-primary rounded-full"></span>
              </span>
            </h2>
          </div>

          <div className="relative mt-16">
            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Continuous dashed line connecting all circles - positioned behind */}
              <div
                className="hidden md:block absolute top-10 left-0 right-0 h-0 border-t-2 border-dashed border-border z-0"
                aria-hidden="true"
                style={{
                  left: "calc(12.5% + 2.5rem)",
                  right: "calc(12.5% + 2.5rem)",
                }}
              />

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center relative group">
                <div className="relative mb-8" style={{ zIndex: 10 }}>
                  <div
                    className="w-20 h-20 rounded-full border-2 border-border group-hover:border-primary flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 cursor-pointer"
                    style={{ backgroundColor: 'hsl(var(--background))' }}
                    role="img"
                    aria-label="Step 1: Browse Vehicles"
                  >
                    <Car
                      className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors duration-300"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <h3 className="font-display font-semibold text-lg mb-3 text-foreground">
                  Browse Vehicles
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Explore 2-wheelers, 4-wheelers & commercial vehicles across
                  10+ cities
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center relative group">
                <div className="relative mb-8" style={{ zIndex: 10 }}>
                  <div
                    className="w-20 h-20 rounded-full border-2 border-border group-hover:border-primary flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 cursor-pointer"
                    style={{ backgroundColor: 'hsl(var(--background))' }}
                    role="img"
                    aria-label="Step 2: Register and Pay"
                  >
                    <Shield
                      className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors duration-300"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <h3 className="font-display font-semibold text-lg mb-3 text-foreground">
                  Register & Pay
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Pay your entry fee securely via Razorpay and receive a digital
                  ticket
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center relative group">
                <div className="relative mb-8" style={{ zIndex: 10 }}>
                  <div
                    className="w-20 h-20 rounded-full border-2 border-border group-hover:border-primary flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 cursor-pointer"
                    style={{ backgroundColor: 'hsl(var(--background))' }}
                    role="img"
                    aria-label="Step 3: Attend Offline"
                  >
                    <Gavel
                      className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors duration-300"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <h3 className="font-display font-semibold text-lg mb-3 text-foreground">
                  Attend Offline
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Visit the venue, inspect every vehicle in person before the
                  auction
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center relative group">
                <div className="relative mb-8" style={{ zIndex: 10 }}>
                  <div
                    className="w-20 h-20 rounded-full border-2 border-border group-hover:border-primary flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 cursor-pointer"
                    style={{ backgroundColor: 'hsl(var(--background))' }}
                    role="img"
                    aria-label="Step 4: Win and Drive"
                  >
                    <TrendingUp
                      className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors duration-300"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <h3 className="font-display font-semibold text-lg mb-3 text-foreground">
                  Win & Drive
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Negotiate, close the deal with the seller and drive home the
                  same day
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="py-20 px-4 gradient-gold relative overflow-hidden"
        aria-labelledby="cta-heading"
      >
        {/* Diagonal stripe texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 0px, transparent 50%)",
            backgroundSize: "8px 8px",
          }}
        />

        <div className="container mx-auto relative z-10 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-black/10 rounded-full px-4 py-1.5 mb-6">
            <Gavel className="h-3.5 w-3.5 text-black/70" aria-hidden="true" />
            <span className="text-black/70 text-xs font-medium uppercase tracking-widest font-display">
              Join the Platform
            </span>
          </div>

          {/* Headline */}
          <h2
            id="cta-heading"
            className="text-4xl md:text-5xl font-display font-extrabold text-black mb-4 leading-tight"
          >
            Ready to Start Bidding?
          </h2>

          {/* Subtext */}
          <p className="text-black/70 text-lg mb-3 max-w-md mx-auto leading-relaxed">
            Join thousands of buyers and sellers on Auction Wheels
          </p>
          <p className="text-black/50 text-sm mb-8">
            Free to browse. Pay only when you register for an auction.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-black text-white hover:bg-black/80 font-bold px-10 rounded-xl flex items-center gap-2 transition-all duration-200 cursor-pointer"
              aria-label="Register now to start bidding"
            >
              <Link to="/register">
                Register Now
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-black/30 text-black bg-transparent hover:bg-black/10 font-semibold px-10 rounded-xl transition-all duration-200 cursor-pointer"
              aria-label="Browse all available auctions"
            >
              <Link to="/auctions">Browse Auctions</Link>
            </Button>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {[
              { icon: Shield, label: "Verified Sellers" },
              { icon: CheckCircle, label: "Razorpay Secured" },
              { icon: Users, label: "500+ Happy Buyers" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5 text-black/70" />
                </div>
                <span className="text-black/70 text-sm font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
