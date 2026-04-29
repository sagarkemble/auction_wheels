import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { useAuctionStore } from '@/store/auctionStore';
import { useToast } from '@/hooks/useToast';
import { CITIES } from '@/lib/constants';

export default function CreateAuction() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createAuction } = useAuctionStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    venue: '',
    address: '',
    date: '',
    time: '',
    vehicleLimit: 50,
    buyerFee: 500,
    sellerFee: 1000,
    rules: '',
  });

  if (!user || user.role !== 'vendor') {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Access denied. Only vendors can create auctions.</p>
      </div>
    );
  }

  if (user.kycStatus !== 'approved') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>KYC Approval Required</CardTitle>
            <CardDescription>
              Your vendor account must be approved before you can create auctions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Current Status: <span className="font-medium capitalize">{user.kycStatus}</span>
            </p>
            <Button onClick={() => navigate('/vendor/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createAuction({
      ...formData,
      vendorId: user.id,
    });

    toast({
      title: 'Auction Created Successfully!',
      message: 'It will be reviewed by admin before going live.',
      type: 'success'
    });
    navigate('/vendor/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate('/vendor/dashboard')}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Create New Auction</h1>
        <p className="text-muted-foreground">Fill in the details to host a new vehicle auction</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Auction Details</CardTitle>
            <CardDescription>Provide information about your auction event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Auction Title</label>
                <Input
                  placeholder="e.g., Mumbai Premium Car Auction - May 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="Describe what makes this auction special..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  >
                    <option value="">Select City</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Venue Name</label>
                  <Input
                    placeholder="e.g., Mumbai Auto Expo Center"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Full Address</label>
                <Input
                  placeholder="Complete venue address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Limit</label>
                <Input
                  type="number"
                  min="10"
                  max="200"
                  placeholder="Maximum number of vehicles"
                  value={formData.vehicleLimit}
                  onChange={(e) => setFormData({ ...formData, vehicleLimit: parseInt(e.target.value) })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of vehicles that can be listed in this auction
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Buyer Registration Fee (₹)</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Fee for buyers to attend"
                    value={formData.buyerFee}
                    onChange={(e) => setFormData({ ...formData, buyerFee: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Seller Registration Fee (₹)</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Fee for sellers to list vehicle"
                    value={formData.sellerFee}
                    onChange={(e) => setFormData({ ...formData, sellerFee: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Auction Rules & Policies</label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="List important rules, terms, and conditions for participants..."
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
              <p className="font-medium">Before submitting:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>✓ Double-check all details are correct</li>
                <li>✓ Ensure venue is confirmed and available</li>
                <li>✓ Your auction will be reviewed by admin before going live</li>
                <li>✓ You'll be notified once approved</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/vendor/dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Submit for Approval
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
