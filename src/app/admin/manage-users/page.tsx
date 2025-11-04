import { Suspense } from "react";
import { getAllUsers } from "@/lib/auth";
import UserList from "@/components/admin/UserList";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export default function ManageUsersPage() {
  // create the promise once
  const usersPromise = getAllUsers();

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {/* Suspense boundary to wait for user data */}
      <Suspense fallback={<UserListSkeleton />}>
        <UserListAwait promise={usersPromise} />
      </Suspense>
    </div>
  );
}

// ✅ component that forwards the promise to UserList
function UserListAwait({
  promise,
}: {
  promise: ReturnType<typeof getAllUsers>;
}) {
  return <UserList usersPromise={promise} />;
}

// 🔹 Skeleton loader
function UserListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center border p-3 rounded-lg"
        >
          <div>
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
