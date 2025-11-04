// app/admin/manage-users/page.tsx
import { adminAuth } from "@/lib/firebaseAdmin";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function getAllUsers() {
  const users = [];
  let nextPageToken;

  do {
    const result = await adminAuth.listUsers(1000, nextPageToken);
    users.push(...result.users);
    nextPageToken = result.pageToken;
  } while (nextPageToken);

  return users.map((user) => ({
    uid: user.uid,
    email: user.email,
    isAdmin: user.customClaims?.admin || false,
  }));
}

export default async function ManageUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Registered Users</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {users.map((user) => (
            <div
              key={user.uid}
              className="flex justify-between items-center border p-3 rounded-lg hover:bg-accent/5 transition-all"
            >
              <div>
                <p className="font-medium">{user.email || "No Email"}</p>
                <p className="text-xs text-muted-foreground">{user.uid}</p>
              </div>

              <div className="flex items-center gap-3">
                {user.isAdmin ? (
                  <Badge variant="default">Admin</Badge>
                ) : (
                  <Badge variant="secondary">User</Badge>
                )}

                <form action={`/api/admin/toggle-admin`} method="POST">
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
                  >
                    {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
