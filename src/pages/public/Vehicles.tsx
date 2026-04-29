import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, Car, Truck, Bike } from "lucide-react";
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
import { useVehicleStore } from "@/store/vehicleStore";
import { formatCurrency } from "@/lib/utils";

export default function Vehicles() {
  const { vehicles, filters, setFilters } = useVehicleStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesCategory =
      !filters.category || vehicle.category === filters.category;
    const matchesFuel =
      selectedFuelTypes.length === 0 ||
      selectedFuelTypes.includes(vehicle.fuelType);
    const matchesCondition =
      selectedConditions.length === 0 ||
      selectedConditions.includes(vehicle.condition);
    const matchesSearch =
      !searchTerm ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriceMin =
      !priceMin || vehicle.basePrice >= parseInt(priceMin);
    const matchesPriceMax =
      !priceMax || vehicle.basePrice <= parseInt(priceMax);

    return (
      matchesCategory &&
      matchesFuel &&
      matchesCondition &&
      matchesSearch &&
      matchesPriceMin &&
      matchesPriceMax
    );
  });

  const toggleFuelType = (fuel: string) => {
    setSelectedFuelTypes((prev) =>
      prev.includes(fuel) ? prev.filter((f) => f !== fuel) : [...prev, fuel],
    );
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition],
    );
  };

  const clearAllFilters = () => {
    setFilters({ category: "", fuelType: "", condition: "" });
    setSearchTerm("");
    setPriceMin("");
    setPriceMax("");
    setSelectedFuelTypes([]);
    setSelectedConditions([]);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-500";
      case "good":
        return "bg-yellow-500";
      case "fair":
        return "bg-orange-500";
      case "poor":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 fade-in-up">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
          All Vehicles
        </h1>
        <p className="text-muted-foreground">
          Browse vehicles from all auctions
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Left Sidebar - Filters */}
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-semibold mb-3 text-sm">Category</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setFilters({ category: "" })}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      !filters.category
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Car className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">All Vehicles</span>
                  </button>
                  <button
                    onClick={() => setFilters({ category: "2_WHEELER" })}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      filters.category === "2_WHEELER"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Bike className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">2 Wheeler</span>
                  </button>
                  <button
                    onClick={() => setFilters({ category: "4_WHEELER" })}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      filters.category === "4_WHEELER"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Car className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">4 Wheeler</span>
                  </button>
                  <button
                    onClick={() => setFilters({ category: "COMMERCIAL" })}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      filters.category === "COMMERCIAL"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Commercial</span>
                  </button>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3 text-sm">Price Range</h3>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Min Price"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max Price"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                  />
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <h3 className="font-semibold mb-3 text-sm">Fuel Type</h3>
                <div className="space-y-2">
                  {["Petrol", "Diesel", "Electric", "Hybrid", "CNG"].map(
                    (fuel) => (
                      <label
                        key={fuel}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFuelTypes.includes(fuel)}
                          onChange={() => toggleFuelType(fuel)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{fuel}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              {/* Condition */}
              <div>
                <h3 className="font-semibold mb-3 text-sm">Condition</h3>
                <div className="space-y-2">
                  {[
                    { value: "excellent", label: "Excellent" },
                    { value: "good", label: "Good" },
                    { value: "fair", label: "Fair" },
                    { value: "poor", label: "Poor" },
                  ].map((condition) => (
                    <label
                      key={condition.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(condition.value)}
                        onChange={() => toggleCondition(condition.value)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div
                        className={`w-3 h-3 rounded-full ${getConditionColor(condition.value)}`}
                      ></div>
                      <span className="text-sm">{condition.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Right Content - Vehicle Grid */}
        <div>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by make or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-sm text-muted-foreground">
            Showing {filteredVehicles.length} vehicle
            {filteredVehicles.length !== 1 ? "s" : ""}
          </div>

          {/* Vehicle Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <Card
                key={vehicle.id}
                className="card-hover overflow-hidden group"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={vehicle.photos[0]}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=60";
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                  <Badge className="absolute top-3 left-3 gradient-gold text-black border-0">
                    {vehicle.category.replace("_", "-")}
                  </Badge>
                  <Badge className="absolute top-3 right-3 bg-white/90 text-black border-0 capitalize">
                    {vehicle.condition}
                  </Badge>
                  <button className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <Heart className="h-4 w-4" />
                    </div>
                  </button>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-display line-clamp-1">
                    {vehicle.make} {vehicle.model}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {vehicle.year} • {vehicle.odometer.toLocaleString()} km
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {vehicle.fuelType}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {vehicle.transmission}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-display font-bold text-primary">
                      {formatCurrency(vehicle.basePrice)}
                    </span>
                  </div>
                  <Button asChild className="w-full" size="sm">
                    <Link to={`/vehicles/${vehicle.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredVehicles.length === 0 && (
            <div className="text-center py-16">
              <Car className="h-24 w-24 text-primary/20 mx-auto mb-4" />
              <h3 className="text-2xl font-display font-bold mb-2">
                No vehicles found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
