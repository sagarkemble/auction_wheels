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
import { Car } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user) {
        navigate(`/${user.role}/dashboard`);
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
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
              Welcome Back
            </h1>
            <p className="text-xl text-white/70">
              Login to access your dashboard and manage your auctions
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md fade-in-up">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Car className="h-6 w-6 text-primary" />
              <span className="text-xl font-display font-bold">
                Auction <span className="text-gradient-gold">Wheels</span>
              </span>
            </Link>
          </div>

          <Card className="border-primary/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-display font-bold">
                Login
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-11 gradient-gold text-black hover:opacity-90 font-semibold"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <Link
                  to="/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:underline font-semibold"
                >
                  Register
                </Link>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-primary/10">
                <p className="text-xs font-semibold mb-3 text-muted-foreground">
                  Demo Accounts:
                </p>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Admin:</span>
                    <span className="font-mono">
                      admin@auctionwheels.com / admin123
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vendor:</span>
                    <span className="font-mono">
                      rajesh@autoauctions.com / vendor123
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seller:</span>
                    <span className="font-mono">
                      rahul@email.com / seller123
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buyer:</span>
                    <span className="font-mono">
                      vikram@email.com / buyer123
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
