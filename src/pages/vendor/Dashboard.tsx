import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useAuctionStore } from "@/store/auctionStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gavel, Users, Star, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function VendorDashboard() {
  const { user } = useAuthStore();
  const { auctions } = useAuctionStore();

  const vendorAuctions = auctions.filter(
    (auction) => auction.vendorId === user?.id,
  );
  const pendingAuctions = vendorAuctions.filter(
    (auction) => auction.status === "pending",
  );
  const approvedAuctions = vendorAuctions.filter(
    (auction) => auction.status === "approved",
  );
  const liveAuctions = vendorAuctions.filter(
    (auction) => auction.status === "live",
  );

  const totalBuyers = vendorAuctions.reduce(
    (sum, auction) => sum + auction.registeredBuyers.length,
    0,
  );
  const totalSellers = vendorAuctions.reduce(
    (sum, auction) => sum + auction.registeredSellers.length,
    0,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>
        {user?.kycStatus === "approved" && (
          <div className="flex items-center gap-2">
            <Badge variant="default">Verified Vendor</Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold">{user?.rating || 0}</span>
            </div>
          </div>
        )}
        {user?.kycStatus === "pending" && (
          <Badge variant="secondary">KYC Pending</Badge>
        )}
      </div>

      {user?.kycStatus === "pending" && (
        <Card className="mb-8 border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>KYC Under Review</CardTitle>
            <CardDescription>
              Your vendor application is being reviewed by our admin team.
              You'll be notified once approved.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Auctions
            </CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendorAuctions.length}</div>
            <p className="text-xs text-muted-foreground">Hosted auctions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Buyers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBuyers}</div>
            <p className="text-xs text-muted-foreground">Registered buyers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSellers}</div>
            <p className="text-xs text-muted-foreground">Registered sellers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Auctions</CardTitle>
            <CardDescription>Manage your hosted auctions</CardDescription>
          </CardHeader>
          <CardContent>
            {vendorAuctions.length === 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  No auctions created yet
                </p>
                <Button disabled={user?.kycStatus !== "approved"} asChild>
                  <Link to="/vendor/create-auction">Create Auction</Link>
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                {pendingAuctions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">
                      Pending Approval ({pendingAuctions.length})
                    </h3>
                    <div className="space-y-2">
                      {pendingAuctions.map((auction) => (
                        <div
                          key={auction.id}
                          className="p-3 border rounded-lg space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">
                                {auction.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {format(
                                    new Date(auction.date),
                                    "MMM dd, yyyy",
                                  )}
                                </span>
                                <MapPin className="h-3 w-3 ml-1" />
                                <span>{auction.city}</span>
                              </div>
                            </div>
                            <Badge variant="secondary">Pending</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {approvedAuctions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">
                      Approved ({approvedAuctions.length})
                    </h3>
                    <div className="space-y-2">
                      {approvedAuctions.map((auction) => (
                        <div
                          key={auction.id}
                          className="p-3 border rounded-lg space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">
                                {auction.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {format(
                                    new Date(auction.date),
                                    "MMM dd, yyyy",
                                  )}
                                </span>
                                <MapPin className="h-3 w-3 ml-1" />
                                <span>{auction.city}</span>
                              </div>
                            </div>
                            <Badge variant="default">Approved</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {liveAuctions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">
                      Live ({liveAuctions.length})
                    </h3>
                    <div className="space-y-2">
                      {liveAuctions.map((auction) => (
                        <div
                          key={auction.id}
                          className="p-3 border rounded-lg space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">
                                {auction.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {format(
                                    new Date(auction.date),
                                    "MMM dd, yyyy",
                                  )}
                                </span>
                                <MapPin className="h-3 w-3 ml-1" />
                                <span>{auction.city}</span>
                              </div>
                            </div>
                            <Badge className="bg-green-500">Live</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  disabled={user?.kycStatus !== "approved"}
                  className="w-full"
                  asChild
                >
                  <Link to="/vendor/create-auction">Create New Auction</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Info</CardTitle>
            <CardDescription>Your vendor details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Business Name:</span>
              <span className="font-medium">{user?.businessName || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">City:</span>
              <span className="font-medium">{user?.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rating:</span>
              <span className="font-medium">{user?.rating || "Not rated"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
