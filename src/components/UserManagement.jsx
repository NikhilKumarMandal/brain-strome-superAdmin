
import React, { useState } from 'react';
import { Search, History, Shield, User as UserIcon, Crown} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

const UserManagement = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const mockUsers = [
    {
      id: '1',
      email: 'john.doe@example.com',
      role: 'user',
      name: 'John Doe',
      joinDate: '2024-01-15',
      lastActive: '2024-06-20',
      status: 'active',
      history: [
        { action: 'Login', date: '2024-06-20', details: 'Logged in from Chrome browser' },
        { action: 'Profile Update', date: '2024-06-18', details: 'Updated profile picture' },
        { action: 'Course Enrollment', date: '2024-06-15', details: 'Enrolled in React Advanced Course' }
      ]
    },
    {
      id: '2',
      email: 'admin@example.com',
      role: 'admin',
      name: 'Admin User',
      joinDate: '2024-01-01',
      lastActive: '2024-06-24',
      status: 'active',
      history: [
        { action: 'User Role Update', date: '2024-06-24', details: 'Updated user roles for 3 users' },
        { action: 'Team Creation', date: '2024-06-23', details: 'Created new development team' }
      ]
    },
    {
      id: '3',
      email: 'jane.smith@example.com',
      role: 'user',
      name: 'Jane Smith',
      joinDate: '2024-02-10',
      lastActive: '2024-06-22',
      status: 'active',
      history: [
        { action: 'Course Completion', date: '2024-06-22', details: 'Completed Node.js Backend Course' }
      ]
    }
  ];

  const handleSearch = () => {
    if (!searchEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to search.",
        variant: "destructive"
      });
      return;
    }

    const results = mockUsers.filter(u => 
      u.email.toLowerCase().includes(searchEmail.toLowerCase())
    );
    
    setSearchResults(results);
    setSelectedUser(null);
    setShowHistory(false);
    
    if (results.length === 0) {
      toast({
        title: "No Users Found",
        description: "No users found matching the search criteria.",
        variant: "destructive"
      });
    }
  };

  const handlePromoteUser = (user, newRole) => {
    const updatedResults = searchResults.map(u => 
      u.id === user.id ? { ...u, role: newRole } : u
    );
    setSearchResults(updatedResults);
    
    toast({
      title: "User Promoted",
      description: `Successfully updated ${user.name}'s role to ${newRole}`
    });
  };

  const handleShowHistory = (user) => {
    setSelectedUser(user);
    setShowHistory(true);
    toast({
      title: "User History Retrieved",
      description: `Retrieved ${user.history.length} history entries for ${user.name}`
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'superadmin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'superadmin': return <Crown className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return <UserIcon className="h-4 w-4" />;
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
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>Found {searchResults.length} user(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((user) => (
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
                      <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {user.status.toUpperCase()}
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
            <div className="space-y-3">
              {selectedUser.history.map((item, index) => (
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