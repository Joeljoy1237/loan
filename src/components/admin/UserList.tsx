import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function UserList({
  usersPromise,
}: {
  usersPromise: Promise<{ uid: string; email?: string; isAdmin: boolean }[]>;
}) {
  const users = await usersPromise;

  return (
    <Card className="shadow-lg border border-border/50 rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">
          All Registered Users
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No registered users found.
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user.uid}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center border border-border/40 bg-card/30 p-4 rounded-xl hover:bg-accent/10 transition-colors"
            >
              <div className="flex flex-col gap-1 mb-3 sm:mb-0">
                <p className="font-medium text-sm sm:text-base truncate max-w-[250px]">
                  {user.email || "No Email"}
                </p>
                <p className="text-xs text-muted-foreground break-all trancate">
                  {user.uid}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-end">
                <Badge
                  variant={user.isAdmin ? "default" : "secondary"}
                  className="text-xs px-2 py-1 rounded-full"
                >
                  {user.isAdmin ? "Admin" : "User"}
                </Badge>

                <form
                  action={`/api/admin/toggle-admin`}
                  method="POST"
                  className="shrink-0"
                >
                  <input type="hidden" name="uid" value={user.uid} />
                  <input
                    type="hidden"
                    name="makeAdmin"
                    value={(!user.isAdmin).toString()}
                  />
                  <Button
                    variant={user.isAdmin ? "destructive" : "outline"}
                    size="sm"
                    type="submit"
                    className="text-xs sm:text-sm"
                  >
                    {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                  </Button>
                </form>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
