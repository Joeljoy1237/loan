// app/unauthorized/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Access denied",
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="flex items-start gap-4">
            <div className="p-3 rounded-md bg-red-50">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Access denied</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                You don’t have permission to view this page.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="mt-2 space-y-6">
            <p className="text-sm text-muted-foreground">
              This area is restricted to administrators only. If you believe this is an error, please contact the site administrator or request access.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="ghost" className="w-full">
                  Go to Home
                </Button>
              </Link>

              <Link href="/admin" className="w-full sm:w-auto">
                <Button className="w-full" disabled>
                  Admin Dashboard
                </Button>
              </Link>

              <Link href="/support" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground">
              Tip: if you were recently granted admin access, sign out and sign back in to refresh your session/claims.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
