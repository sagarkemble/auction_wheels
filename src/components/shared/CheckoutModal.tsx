import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Smartphone, Building2, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useAuctionStore } from '@/store/auctionStore';

interface CheckoutModalProps {
  auctionId: string;
  role: 'buyer' | 'seller';
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutModal({ auctionId, role, onClose, onSuccess }: CheckoutModalProps) {
  const { user } = useAuthStore();
  const { getAuctionById, registerForAuction } = useAuctionStore();
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [transactionId] = useState(() => Date.now().toString().slice(-8));

  const auction = getAuctionById(auctionId);
  if (!auction || !user) return null;

  const fee = role === 'buyer' ? auction.buyerFee : auction.sellerFee;
  const platformFee = Math.round(fee * 0.02);
  const gst = Math.round((fee + platformFee) * 0.18);
  const total = fee + platformFee + gst;

  const handlePayment = () => {
    setStep('processing');

    setTimeout(() => {
      setStep('success');
      registerForAuction(auctionId, user.id, role);

      const updatedAuctions = [...(user.registeredAuctions || []), auctionId];
      useAuthStore.getState().updateUser({ registeredAuctions: updatedAuctions });

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
      <Card className="w-full max-w-lg shadow-2xl border-primary/20 animate-in zoom-in-95">
        {step === 'details' && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-display">Registration Checkout</CardTitle>
              <CardDescription>
                {role === 'buyer' ? 'Buyer' : 'Seller'} registration for {auction.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Receipt Style Breakdown */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg border border-dashed border-primary/20">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Registration Fee</span>
                  <span className="font-medium">{formatCurrency(fee)}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-dotted border-border pb-3">
                  <span className="text-muted-foreground">Platform Fee (2%)</span>
                  <span className="font-medium">{formatCurrency(platformFee)}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-dotted border-border pb-3">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span className="font-medium">{formatCurrency(gst)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span className="font-display">Total Amount</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2 text-sm">
                <p className="font-semibold font-display mb-3">What you get:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Digital ticket with QR code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Entry to auction venue</span>
                  </div>
                  {role === 'buyer' && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Access to all vehicles in auction</span>
                    </div>
                  )}
                  {role === 'seller' && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Ability to list your vehicle</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => setStep('payment')} className="flex-1 gradient-gold text-black hover:opacity-90 font-semibold">
                  Proceed to Payment
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {step === 'payment' && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-display">Select Payment Method</CardTitle>
              <CardDescription>Choose how you want to pay {formatCurrency(total)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`w-full p-4 border-2 rounded-lg flex items-center gap-4 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-primary bg-primary/5 shadow-[0_0_0_2px_#f59e0b]'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold">UPI</div>
                    <div className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</div>
                  </div>
                  {paymentMethod === 'upi' && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </button>

                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full p-4 border-2 rounded-lg flex items-center gap-4 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/5 shadow-[0_0_0_2px_#f59e0b]'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold">Credit / Debit Card</div>
                    <div className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</div>
                  </div>
                  {paymentMethod === 'card' && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </button>

                <button
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`w-full p-4 border-2 rounded-lg flex items-center gap-4 transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-primary bg-primary/5 shadow-[0_0_0_2px_#f59e0b]'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold">Net Banking</div>
                    <div className="text-xs text-muted-foreground">All major banks</div>
                  </div>
                  {paymentMethod === 'netbanking' && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </button>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-sm">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Secure Payment
                </p>
                <p className="text-xs text-muted-foreground">
                  Your payment is processed securely through Razorpay. We never store your card details.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                  Back
                </Button>
                <Button onClick={handlePayment} className="flex-1 gradient-gold text-black hover:opacity-90 font-semibold">
                  Pay {formatCurrency(total)}
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {step === 'processing' && (
          <CardContent className="py-16">
            <div className="text-center space-y-6">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 bg-primary/20 rounded-full animate-ping"></div>
                </div>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl mb-2">Processing Payment</h3>
                <p className="text-sm text-muted-foreground">Please wait while we confirm your payment...</p>
              </div>
            </div>
          </CardContent>
        )}

        {step === 'success' && (
          <CardContent className="py-16">
            <div className="text-center space-y-6 animate-in zoom-in">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border-4 border-green-500/20">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl mb-2">Payment Successful!</h3>
                <p className="text-muted-foreground">
                  Your registration is confirmed. Check your dashboard for your ticket.
                </p>
              </div>
              <Badge className="text-base px-6 py-2 bg-primary/10 text-primary border border-primary/20">
                Transaction ID: TXN{transactionId}
              </Badge>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
