import { Link } from "react-router-dom";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="text-center fade-in-up">
        <div className="mb-8">
          <h1 className="text-9xl font-display font-bold text-gradient-gold mb-4">
            404
          </h1>
          <h2 className="text-3xl font-display font-bold mb-2">
            Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="gradient-gold text-black hover:opacity-90 font-semibold"
            asChild
          >
            <Link to="/">
              <Car className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/auctions">Browse Auctions</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
