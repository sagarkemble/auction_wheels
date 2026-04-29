import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useAuctionStore } from "@/store/auctionStore";
import { useVehicleStore } from "@/store/vehicleStore";
import { VEHICLE_CATEGORIES, TRANSMISSIONS, CONDITIONS } from "@/lib/constants";
import { VehicleCategory } from "@/types";

export default function ListVehicle() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { auctions } = useAuctionStore();
  const { createVehicle } = useVehicleStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    auctionId: "",
    category: "" as VehicleCategory | "",
    type: "",
    fuelType: "",
    transmission: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    odometer: 0,
    purchaseDate: "",
    condition: "",
    description: "",
    basePrice: 0,
  });
  const [photos, setPhotos] = useState<string[]>([]);

  if (!user || user.role !== "seller") {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Access denied. Only sellers can list vehicles.</p>
      </div>
    );
  }

  const registeredAuctions = auctions.filter(
    (a) => user.registeredAuctions?.includes(a.id) && a.status === "approved",
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, upload to server and get URLs
      // For now, use placeholder images
      const newPhotos = Array.from(files).map(
        (_, index) =>
          `https://images.unsplash.com/photo-${1550000000000 + index}?w=800`,
      );
      setPhotos([...photos, ...newPhotos].slice(0, 6));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (photos.length < 3) {
      alert("Please upload at least 3 photos");
      return;
    }

    const vehicle = createVehicle({
      ...formData,
      sellerId: user.id,
      category: formData.category as VehicleCategory,
      photos,
    });

    alert("Vehicle listed successfully!");
    navigate(`/vehicles/${vehicle.id}`);
  };

  const availableTypes = formData.category
    ? VEHICLE_CATEGORIES[formData.category].types
    : [];
  const availableFuels = formData.category
    ? VEHICLE_CATEGORIES[formData.category].fuels
    : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate("/seller/dashboard")}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">List Your Vehicle</h1>
        <p className="text-muted-foreground">
          Fill in the details to list your vehicle in an auction
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                s === step
                  ? "bg-primary text-primary-foreground"
                  : s < step
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div
                className={`w-16 h-1 ${s < step ? "bg-primary" : "bg-muted"}`}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Select Auction"}
            {step === 2 && "Vehicle Category & Type"}
            {step === 3 && "Vehicle Details"}
            {step === 4 && "Photos & Description"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Choose which auction to list your vehicle in"}
            {step === 2 && "Select the category and specifications"}
            {step === 3 && "Provide detailed information about your vehicle"}
            {step === 4 && "Upload photos and add description"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              {registeredAuctions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    You haven't registered for any auctions yet
                  </p>
                  <Button onClick={() => navigate("/auctions")}>
                    Browse Auctions
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {registeredAuctions.map((auction) => (
                    <button
                      key={auction.id}
                      onClick={() => {
                        setFormData({ ...formData, auctionId: auction.id });
                        setStep(2);
                      }}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                        formData.auctionId === auction.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold">{auction.title}</div>
                        <Badge variant="secondary">
                          {auction.vehicleCount}/{auction.vehicleLimit}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {auction.city} • {auction.date}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Category</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as VehicleCategory,
                      type: "",
                      fuelType: "",
                    })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  <option value="2_WHEELER">2 Wheeler</option>
                  <option value="4_WHEELER">4 Wheeler</option>
                  <option value="COMMERCIAL">Commercial Vehicle</option>
                </select>
              </div>

              {formData.category && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vehicle Type</label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Type</option>
                      {availableTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fuel Type</label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                      value={formData.fuelType}
                      onChange={(e) =>
                        setFormData({ ...formData, fuelType: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Fuel Type</option>
                      {availableFuels.map((fuel) => (
                        <option key={fuel} value={fuel}>
                          {fuel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Transmission</label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                      value={formData.transmission}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          transmission: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Transmission</option>
                      {TRANSMISSIONS.map((trans) => (
                        <option key={trans} value={trans.toLowerCase()}>
                          {trans}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={
                    !formData.category ||
                    !formData.type ||
                    !formData.fuelType ||
                    !formData.transmission
                  }
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Make</label>
                  <Input
                    placeholder="e.g., Honda, Toyota"
                    value={formData.make}
                    onChange={(e) =>
                      setFormData({ ...formData, make: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Model</label>
                  <Input
                    placeholder="e.g., City, Fortuner"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        year: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <Input
                    placeholder="e.g., White, Black"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Odometer (km)</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.odometer}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        odometer: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Purchase Date</label>
                  <Input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, purchaseDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Condition</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData({ ...formData, condition: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Condition</option>
                    {CONDITIONS.map((cond) => (
                      <option key={cond} value={cond.toLowerCase()}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Base Price (₹)</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Minimum starting bid"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        basePrice: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  disabled={
                    !formData.make || !formData.model || !formData.basePrice
                  }
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Photos (Minimum 3 required)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden border"
                    >
                      <img
                        src={photo}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 6 && (
                    <label className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">
                        Upload Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload at least 3 photos (max 6). Include front, back, sides,
                  interior, and odometer.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="Describe your vehicle's condition, features, service history, etc."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={photos.length < 3 || !formData.description}
                  className="flex-1"
                >
                  List Vehicle
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
