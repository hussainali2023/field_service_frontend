"use client";

import * as React from "react";
import { useUsers, useUpdateUserStatus, useDeleteUser } from "@/hooks/admin.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import { User, UserStatus } from "@/types";
import { Search, UserCheck, UserX, Shield, Trash2 } from "lucide-react";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL");

  const { data: usersData, isLoading, refetch } = useUsers({
    searchTerm: searchTerm || undefined,
    role: roleFilter === "ALL" ? undefined : roleFilter,
  });
  const { mutate: updateStatus, isPending: updating } = useUpdateUserStatus();
  const { mutate: deleteUser, isPending: deleting } = useDeleteUser();

  const users: User[] = usersData?.data || [];

  const handleToggleStatus = (u: User) => {
    const nextStatus: UserStatus = u.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    updateStatus(
      { id: u.id, status: nextStatus },
      {
        onSuccess: () => {
          toast.success(`User status changed to ${nextStatus}`);
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update user status");
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this user from the system?")) {
      deleteUser(id, {
        onSuccess: () => {
          toast.success("User account removed");
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to delete user");
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          User & Account Administration
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Manage system users, view registered profiles, and control platform access permissions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="flex h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="TECHNICIAN">TECHNICIAN</option>
              <option value="CUSTOMER">CUSTOMER</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Assigned Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3, 4].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6} className="py-4">
                      <div className="h-6 w-full rounded-md bg-muted/60 animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : users.length > 0 ? (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
                          {u.name?.[0] || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-foreground">{u.name}</p>
                          <p className="text-[11px] text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          u.role === "ADMIN"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : u.role === "TECHNICIAN"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {u.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          u.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            u.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        {u.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {u.phone || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleToggleStatus(u)}
                        >
                          {u.status === "ACTIVE" ? "Block" : "Activate"}
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => handleDelete(u.id)}
                          title="Delete User"
                        >
                          <Trash2 className="size-3.5 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                    No users matching criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
