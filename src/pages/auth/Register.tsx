import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/useToast";
import { UserRole } from "@/types";
import { CITIES } from "@/lib/constants";
import { Car, Users, ShoppingCart, Store } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole | "">("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    address: "",
    businessName: "",
    auctionPolicies: "",
  });
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setStep(3);
    toast({
      title: "OTP Sent",
      message: `OTP sent to ${formData.email}: ${newOtp}`,
      type: "info",
    });
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      setError("Invalid OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = await register({
        ...formData,
        role: role as UserRole,
      });

      if (user) {
        if (role === "vendor") {
          toast({
            title: "Application Submitted",
            message:
              "Your vendor application has been submitted for review. You will be notified once approved.",
            type: "success",
          });
        } else {
          toast({
            title: "Registration Successful",
            message: "Your account has been created successfully!",
            type: "success",
          });
        }
        navigate("/login");
      }
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      role: "buyer" as UserRole,
      icon: ShoppingCart,
      title: "Buyer",
      description: "Register for auctions and bid on vehicles",
    },
    {
      role: "seller" as UserRole,
      icon: Car,
      title: "Seller",
      description: "List your vehicles in auctions",
    },
    {
      role: "vendor" as UserRole,
      icon: Store,
      title: "Vendor",
      description: "Host auctions in your city",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Left Panel - Dark with Image */}
      <div className="hidden lg:flex bg-[#0f0f0f] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80)",
          }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/60 to-black/80"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-display font-bold">
              Auction <span className="text-gradient-gold">Wheels</span>
            </span>
          </Link>
          <div>
            <h1 className="text-5xl font-display font-bold mb-4">
              Join Us Today
            </h1>
            <p className="text-xl text-white/70">
              Create your account and start your journey in India's premier
              vehicle auction marketplace
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-2xl fade-in-up">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Car className="h-6 w-6 text-primary" />
              <span className="text-xl font-display font-bold">
                Auction <span className="text-gradient-gold">Wheels</span>
              </span>
            </Link>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-3xl font-display font-bold">
                  Register
                </CardTitle>
                {step > 1 && (
                  <div className="flex gap-2">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`h-2 w-8 rounded-full transition-colors ${
                          s <= step ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <CardDescription>
                {step === 1 && "Choose your role to get started"}
                {step === 2 && "Fill in your details"}
                {step === 3 && "Verify your email"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold font-display mb-4">
                    Select Your Role
                  </h3>
                  <div className="grid gap-4">
                    {roleOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.role}
                          onClick={() => handleRoleSelect(option.role)}
                          className="p-6 border-2 rounded-lg hover:border-primary hover:bg-accent transition-all text-left group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold font-display text-lg mb-1">
                                {option.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password</label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <select
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        required
                      >
                        <option value="">Select City</option>
                        {CITIES.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Address</label>
                      <Input
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        required
                        className="h-11"
                      />
                    </div>

                    {role === "vendor" && (
                      <>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">
                            Business Name
                          </label>
                          <Input
                            value={formData.businessName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                businessName: e.target.value,
                              })
                            }
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">
                            Auction Policies
                          </label>
                          <textarea
                            className="flex min-h-25 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={formData.auctionPolicies}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                auctionPolicies: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 gradient-gold text-black hover:opacity-90 font-semibold"
                    >
                      Continue
                    </Button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleOtpVerify} className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold font-display text-xl mb-2">
                      Verify OTP
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code sent to
                      <br />
                      <span className="font-medium text-foreground">
                        {formData.email}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="text-center text-3xl tracking-widest h-14 font-mono"
                      required
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg text-center">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full h-11 gradient-gold text-black hover:opacity-90 font-semibold"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify & Register"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setStep(2)}
                  >
                    Change Email
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-semibold"
                >
                  Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
