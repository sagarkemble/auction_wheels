import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Car, MapPin, Calendar, User as UserIcon } from 'lucide-react';
import { Auction, User } from '@/types';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

interface TicketProps {
  auction: Auction;
  user: User;
  role: 'buyer' | 'seller';
  ticketId: string;
}

export default function Ticket({ auction, user, role, ticketId }: TicketProps) {
  const { toast } = useToast();
  const qrData = JSON.stringify({
    ticketId,
    auctionId: auction.id,
    userId: user.id,
    role,
  });

  const handleDownload = () => {
    toast({
      title: 'Download Started',
      message: 'Your ticket PDF is being generated',
      type: 'info'
    });
  };

  return (
    <Card className="max-w-3xl mx-auto overflow-hidden border-primary/20 shadow-lg">
      {/* Torn Edge Effect using gradient */}
      <div className="h-2 gradient-gold"></div>

      <CardHeader className="bg-linear-to-r from-primary/10 to-primary/5 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span className="text-xl font-display font-bold">Auction Wheels</span>
              <div className="text-xs text-muted-foreground">Official Entry Ticket</div>
            </div>
          </div>
          <Badge className={role === 'buyer' ? 'status-approved' : 'status-live'}>
            {role === 'buyer' ? 'BUYER' : 'SELLER'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid md:grid-cols-[1fr_auto] gap-8">
          {/* Left Section - Ticket Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-2">{auction.title}</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{auction.city}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg border border-primary/10">
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Venue
                </div>
                <div className="font-semibold">{auction.venue}</div>
                <div className="text-sm text-muted-foreground mt-1">{auction.address}</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg border border-primary/10">
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Date & Time
                </div>
                <div className="font-semibold">{formatDate(auction.date)}</div>
                <div className="text-sm text-muted-foreground mt-1">{auction.time}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-dashed border-primary/20">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <UserIcon className="h-3 w-3" />
                    Ticket Holder
                  </div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Ticket ID</div>
                  <div className="font-mono font-semibold text-primary">{ticketId}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-dashed border-primary/20">
              <div className="text-xs text-muted-foreground space-y-2">
                <p className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Please arrive 30 minutes before the auction starts</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Bring a valid government ID for verification</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>This ticket is non-transferable</span>
                </p>
                {role === 'buyer' && (
                  <p className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>One ticket grants access to all vehicles in this auction</span>
                  </p>
                )}
                {role === 'seller' && (
                  <p className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>You can list your vehicle after registration</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - QR Code with Torn Edge Effect */}
          <div className="relative">
            {/* Vertical torn edge separator */}
            <div className="hidden md:block absolute -left-4 top-0 bottom-0 w-8">
              <div className="h-full border-l-2 border-dashed border-primary/20"></div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-primary/5 rounded-lg border-2 border-dashed border-primary/20">
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <QRCodeSVG value={qrData} size={180} level="H" />
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-2">Scan at venue entrance</div>
                <Badge className="status-live">Active</Badge>
              </div>
              <div className="text-center pt-2 border-t border-primary/20 w-full">
                <div className="text-xs font-mono text-muted-foreground">
                  {ticketId}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-primary/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs text-muted-foreground">
            Generated on {new Date().toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short'
            })}
          </div>
          <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
