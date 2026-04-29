import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import { useAuctionStore } from "@/store/auctionStore";
import { formatDate } from "@/lib/utils";
import usersData from "@/data/users.json";

export default function AdminApprovals() {
  const { user } = useAuthStore();
  const { auctions, updateAuction } = useAuctionStore();
  const [vendorRating, setVendorRating] = useState<{ [key: string]: number }>(
    {},
  );

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Access denied. Admin only.</p>
      </div>
    );
  }

  const pendingVendors = usersData.filter(
    (u) => u.role === "vendor" && u.kycStatus === "pending",
  );
  const pendingAuctions = auctions.filter((a) => a.status === "pending");

  const handleVendorApproval = (vendorId: string, approved: boolean) => {
    const rating = vendorRating[vendorId] || 4.0;
    if (approved) {
      alert(
        `Vendor approved with rating ${rating}! In a real app, this would update the database.`,
      );
    } else {
      const reason = prompt("Enter rejection reason:");
      if (reason) {
        alert(`Vendor rejected. Reason: ${reason}`);
      }
    }
  };

  const handleAuctionApproval = (auctionId: string, approved: boolean) => {
    if (approved) {
      updateAuction(auctionId, { status: "approved" });
      alert("Auction approved and is now live!");
    } else {
      const reason = prompt("Enter rejection reason:");
      if (reason) {
        updateAuction(auctionId, { status: "cancelled" });
        alert(`Auction rejected. Reason: ${reason}`);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Approvals</h1>
        <p className="text-muted-foreground">
          Review and approve vendor applications and auctions
        </p>
      </div>

      <Tabs defaultValue="vendors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="vendors">
            Vendor KYC ({pendingVendors.length})
          </TabsTrigger>
          <TabsTrigger value="auctions">
            Auctions ({pendingAuctions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-4">
          {pendingVendors.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No pending vendor applications
              </CardContent>
            </Card>
          ) : (
            pendingVendors.map((vendor) => (
              <Card key={vendor.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{vendor.name}</CardTitle>
                      <CardDescription>{vendor.businessName}</CardDescription>
                    </div>
                    <Badge variant="secondary">Pending Review</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <div className="font-medium">{vendor.email}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <div className="font-medium">{vendor.phone}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">City:</span>
                      <div className="font-medium">{vendor.city}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Address:</span>
                      <div className="font-medium">{vendor.address}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">KYC Documents</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {vendor.kycDocuments?.shopLicense && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Shop License
                          </p>
                          <img
                            src={vendor.kycDocuments.shopLicense}
                            alt="Shop License"
                            className="w-full h-32 object-cover rounded border"
                          />
                        </div>
                      )}
                      {vendor.kycDocuments?.governmentId && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Government ID
                          </p>
                          <img
                            src={vendor.kycDocuments.governmentId}
                            alt="Government ID"
                            className="w-full h-32 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {vendor.auctionPolicies && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2">Auction Policies</h4>
                      <p className="text-sm text-muted-foreground">
                        {vendor.auctionPolicies}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <label className="text-sm font-medium mb-2 block">
                      Set Vendor Rating
                    </label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        placeholder="4.5"
                        value={vendorRating[vendor.id] || ""}
                        onChange={(e) =>
                          setVendorRating({
                            ...vendorRating,
                            [vendor.id]: parseFloat(e.target.value),
                          })
                        }
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">
                        out of 5.0
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="destructive"
                      onClick={() => handleVendorApproval(vendor.id, false)}
                      className="flex-1"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleVendorApproval(vendor.id, true)}
                      disabled={!vendorRating[vendor.id]}
                      className="flex-1"
                    >
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="auctions" className="space-y-4">
          {pendingAuctions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No pending auction approvals
              </CardContent>
            </Card>
          ) : (
            pendingAuctions.map((auction) => {
              const vendor = usersData.find((u) => u.id === auction.vendorId);
              return (
                <Card key={auction.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{auction.title}</CardTitle>
                        <CardDescription>
                          Hosted by {vendor?.businessName || vendor?.name}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Pending Review</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{auction.description}</p>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">City:</span>
                        <div className="font-medium">{auction.city}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Venue:</span>
                        <div className="font-medium">{auction.venue}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Date & Time:
                        </span>
                        <div className="font-medium">
                          {formatDate(auction.date)} at {auction.time}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Vehicle Limit:
                        </span>
                        <div className="font-medium">
                          {auction.vehicleLimit} vehicles
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Buyer Fee:
                        </span>
                        <div className="font-medium">₹{auction.buyerFee}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Seller Fee:
                        </span>
                        <div className="font-medium">₹{auction.sellerFee}</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2">Address</h4>
                      <p className="text-sm text-muted-foreground">
                        {auction.address}
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2">Rules & Policies</h4>
                      <p className="text-sm text-muted-foreground">
                        {auction.rules}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="destructive"
                        onClick={() => handleAuctionApproval(auction.id, false)}
                        className="flex-1"
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleAuctionApproval(auction.id, true)}
                        className="flex-1"
                      >
                        Approve & Publish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
