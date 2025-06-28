import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  History,
  Shield,
  User as UserIcon,
  Crown,
  Activity,
  Users,
  MessageSquareX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { banUser, fetchEmail, getUserHistory, updateRole } from "../http/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";
import { formateString } from "../utils/formatString";
import { timeAgo } from "../utils/formatTime";

const LIMIT = 1;

const updateUserRole = async ({ userId, role }) => {
  const { data } = await updateRole(userId, role);
  return data;
};

const banUserOrUnBanUser = async ({ userId, ban }) => {
  const { data } = await banUser(userId, ban);
  return data;
};

const UserManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState({ limit: LIMIT, page: 1 });

  const q = searchParams.get("q") || "";
  const [searchEmail, setSearchEmail] = useState(q);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const queryClient = useQueryClient();
  // const visibleLogs = userLogs?.slice(0, visibleLogsCount);
  useEffect(() => {
    setSearchEmail(q);
  }, [q]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        const params = new URLSearchParams();
        if (value.trim()) params.set("q", value.trim());
        setSearchParams(params);
        setQueryParams((prev) => ({ ...prev, page: 1 }));
      }, 500),
    []
  );

  const { data: userHistoryData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["userHistory", selectedUser?.id],
    queryFn: () => getUserHistory(selectedUser.id).then((res) => res.data),
    enabled: !!selectedUser,
  });
  console.log(userHistoryData?.data);

  const { data = [] } = useQuery({
    queryKey: ["fetchEmail", queryParams, q],
    queryFn: async () => {
      const queryString = new URLSearchParams(
        Object.fromEntries(
          Object.entries(queryParams).filter(([_, val]) => !!val)
        )
      ).toString();

      return await fetchEmail({ queryParams: queryString, q }).then(
        (res) => res.data
      );
    },
  });

  const { mutate: banOrUnban } = useMutation({
    mutationKey: ["ban"],
    mutationFn: banUserOrUnBanUser,
    onSuccess: () => {
      toast.success("User ban/unban status updated");
      queryClient.invalidateQueries({ queryKey: ["fetchEmail"] });
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["updateRole"],
    mutationFn: updateUserRole,
    onSuccess: () => {
      toast.success("Update user role!");
      queryClient.invalidateQueries({ queryKey: ["fetchEmail"] });
    },
    onError: (err) => toast.error(err.message || "Something went wrong"),
  });

  const handlePromoteUser = (userId, newRole) => {
    if (!newRole) {
      toast.error("Please select a valid role");
      return;
    }
    mutate({ userId, role: newRole });
  };

  const handleShowHistory = (user) => {
    setSelectedUser(user);
    setShowHistory(true);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "superadmin":
        return <Crown className="h-4 w-4" />;
      case "admin":
        return <Shield className="h-4 w-4" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Users by Email</span>
          </CardTitle>
          <CardDescription>
            Search for users and manage their roles and history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter email address..."
              value={searchEmail}
              onChange={(e) => {
                setSearchEmail(e.target.value);
                debouncedSearch(e.target.value);
              }}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {q && data?.data?.length > 0 && (
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>Found {data.length} user(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Ban</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(user.role)}
                          <span>{user.role.toUpperCase()}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Select
                          defaultValue={user.role.toUpperCase()}
                          onValueChange={(newRole) => {
                            console.log("Selected Role:", newRole);
                            handlePromoteUser(user.id, newRole);
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USER">User</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="SUPERADMIN">
                              Super Admin
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Select
                          value={String(user.isBanned)}
                          onValueChange={(newValue) => {
                            banOrUnban({
                              userId: user.id,
                              ban: newValue === "true",
                            });
                          }}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue
                              placeholder={user.isBanned ? "BAN" : "UNBAN"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">BAN</SelectItem>
                            <SelectItem value="false">UNBAN</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShowHistory(user)}
                        >
                          <History className="h-4 w-4 mr-1" />
                          History
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {showHistory && selectedUser && (
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>User History - {selectedUser.name}</span>
            </CardTitle>
            <CardDescription>
              Activity history for {selectedUser.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isHistoryLoading?.data ? (
              <p>Loading history...</p>
            ) : userHistoryData?.data?.length > 0 ? (
              <div className="space-y-3">
                {userHistoryData?.data?.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          {selectIcon(item.action)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {formateString(item.action)}
                          </h3>
                          {item.timestamp && (
                            <span className="text-sm text-gray-500 font-medium">
                              {timeAgo(item.timestamp)}
                            </span>
                          )}
                        </div>
                        {item.teamName && (
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Team: {item.teamName}
                          </p>
                        )}
                        {item.reason && (
                          <p className="text-sm text-gray-700">
                            Reason: {item.reason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No history found for this user.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

function selectIcon(action) {
  switch (action) {
    case "TEAM_CREATED":
      return <Users className="h-4 w-4" />;
    case "DISBAND_TEAM":
      return <MessageSquareX className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
}

export default UserManagement;
