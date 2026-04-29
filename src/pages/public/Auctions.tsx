import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Calendar, Gavel } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuctionStore } from "@/store/auctionStore";
import { formatDate, formatCurrency } from "@/lib/utils";
import { CITIES } from "@/lib/constants";

export default function Auctions() {
  const { auctions, filters, setFilters } = useAuctionStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAuctions = auctions.filter((auction) => {
    const matchesCity = !filters.city || auction.city === filters.city;
    const matchesStatus = !filters.status || auction.status === filters.status;
    const matchesSearch =
      !searchTerm ||
      auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.description.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesCity &&
      matchesStatus &&
      matchesSearch &&
      (auction.status === "approved" || auction.status === "live")
    );
  });

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
    <div className="container mx-auto px-4 py-8 fade-in-up">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <span>Auctions</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              All Auctions
            </h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-green-500">{filteredAuctions.length} Live</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredAuctions.length} of {auctions.filter(a => a.status === "approved" || a.status === "live").length} auctions
          </div>
        </div>
        <p className="text-muted-foreground">
          Browse upcoming vehicle auctions across India
        </p>
      </div>

      {/* Filters - Sticky Bar */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur -mx-4 px-4 py-4 mb-8 border-y border-primary/20">
        <div className="container mx-auto flex flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 rounded-lg border-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <select
            className="h-11 rounded-lg border border-gray-700 bg-background px-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            value={filters.city}
            onChange={(e) => setFilters({ city: e.target.value })}
          >
            <option value="">All Cities</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <select
            className="h-11 rounded-lg border border-gray-700 bg-background px-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="approved">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>
          <Button
            variant="outline"
            className="h-11 rounded-lg border-amber-500 text-amber-500 hover:bg-amber-500/10"
            onClick={() => {
              setFilters({ city: "", status: "" });
              setSearchTerm("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-sm text-muted-foreground">
        Showing {filteredAuctions.length} auction
        {filteredAuctions.length !== 1 ? "s" : ""}
      </div>

      {/* Auction Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6 items-stretch">
        {filteredAuctions.map((auction) => (
          <Card key={auction.id} className="card-hover overflow-hidden border-l-2 border-amber-500 flex flex-col">
            <div className="h-2 gradient-gold"></div>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={getStatusBadgeClass(auction.status)}>
                  {auction.status}
                </Badge>
              </div>
              <CardTitle className="line-clamp-2 font-display">
                {auction.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {auction.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{auction.city}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {formatDate(auction.date)} at {auction.time}
                </span>
              </div>

              {/* Capacity Indicator */}
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">
                    {auction.vehicleCount} / {auction.vehicleLimit} vehicles
                  </span>
                  <span className="text-muted-foreground">
                    {Math.round(
                      (auction.vehicleCount / auction.vehicleLimit) * 100,
                    )}
                    %
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

              <div className="pt-3 border-t space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Buyer Fee:</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(auction.buyerFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Seller Fee:</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(auction.sellerFee)}
                  </span>
                </div>
              </div>
              <div className="mt-auto">
                <Link to={`/auctions/${auction.id}`}>
                  <Button className="w-full mt-2">View Auction →</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAuctions.length === 0 && (
        <div className="text-center py-16">
          <Gavel className="h-24 w-24 text-primary/20 mx-auto mb-4" />
          <h3 className="text-2xl font-display font-bold mb-2">
            No auctions found
          </h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or search terms
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setFilters({ city: "", status: "" });
              setSearchTerm("");
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
