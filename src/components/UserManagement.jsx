
import React, { useState,useEffect,useMemo } from 'react';
import { Search, History, Shield, User as UserIcon, Crown} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { fetchEmail } from '../http/api';
import { useQuery,keepPreviousData } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import debounce from "lodash.debounce";

const LIMIT = 1;

const UserManagement = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [queryParams, setQueryParams] = useState({ limit: LIMIT, page: 1 });
  
    const q = searchParams.get("q") || "";
    const [searchEmail, setSearchEmail] = useState(q);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
  
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
  
    const { data = [] } = useQuery({
      queryKey: ["fetchEmail", queryParams, q],
      queryFn: async () => {
        const queryString = new URLSearchParams(
          Object.fromEntries(Object.entries(queryParams).filter(([_, val]) => !!val))
        ).toString();
  
        return await fetchEmail({ queryParams: queryString, q }).then((res) => res.data);
      },
      placeholderData: [],
    });

    console.log(data);
    console.log(data.data.length );
  
    const handlePromoteUser = (user, newRole) => {
      toast({
        title: "User Promoted",
        description: `Successfully updated ${user.name}'s role to ${newRole}`,
      });
      // Call your API here to update role
    };
  
    const handleShowHistory = (user) => {
      setSelectedUser(user);
      setShowHistory(true);
      toast({
        title: "User History Retrieved",
        description: `Retrieved ${user.history?.length || 0} history entries for ${user.name}`,
      });
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
  
        {data?.data?.length > 0 && (
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
                          <Select onValueChange={(newRole) => handlePromoteUser(user, newRole)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Promote" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="superadmin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="outline" onClick={() => handleShowHistory(user)}>
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
              <CardDescription>Activity history for {selectedUser.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedUser.history?.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{item.action}</p>
                        <p className="text-xs text-gray-600">{item.details}</p>
                      </div>
                      <span className="text-xs text-gray-500">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

export default UserManagement;