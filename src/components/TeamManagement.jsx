import React, { useState } from 'react';
import { Users, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';


const TeamManagement = () => {
  const [teams, setTeams] = useState([
    {
      id: '1',
      name: 'Frontend Development Team',
      description: 'Responsible for UI/UX development and React applications',
      size: 5,
      maxSize: 8,
      members: [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Lead Developer' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Developer' },
        { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'Designer' }
      ],
      createdDate: '2024-06-01',
      status: 'active'
    },
    {
      id: '2',
      name: 'Backend Development Team',
      description: 'API development and database management',
      size: 4,
      maxSize: 6,
      members: [
        { id: '4', name: 'Alice Johnson', email: 'alice@example.com', role: 'Senior Developer' },
        { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Developer' }
      ],
      createdDate: '2024-05-15',
      status: 'active'
    }
  ]);

  const [teamName, setTeamName] = useState('');
  const [disbandTeamName, setDisbandTeamName] = useState('');


  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      toast({
        title: "Team Name Required",
        description: "Please enter a team name.",
        variant: "destructive"
      });
      return;
    }

    const team = {
      id: Date.now().toString(),
      name: teamName,
      description: `Team managed by admin`,
      size: 0,
      maxSize: 5,
      members: [],
      createdDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setTeams([...teams, team]);
    setTeamName('');
    
    toast({
      title: "Team Created",
      description: `Successfully created team: ${team.name}`
    });
  };

  const handleDisbandTeam = () => {
    if (!disbandTeamName.trim()) {
      toast({
        title: "Team Name Required",
        description: "Please enter the team name to disband.",
        variant: "destructive"
      });
      return;
    }

    const team = teams.find(t => t.name.toLowerCase() === disbandTeamName.toLowerCase());
    if (!team) {
      toast({
        title: "Team Not Found",
        description: "No team found with that name.",
        variant: "destructive"
      });
      return;
    }

    setTeams(teams.filter(t => t.id !== team.id));
    setDisbandTeamName('');
    
    toast({
      title: "Team Disbanded",
      description: `Successfully disbanded team: ${team.name}`
    });
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Admin Team Management</span>
          </CardTitle>
          <CardDescription>
            Create new teams or disband existing ones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <label className="text-sm font-medium">Disband Team</label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter team name to disband..."
                  value={disbandTeamName}
                  onChange={(e) => setDisbandTeamName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleDisbandTeam()}
                />
                <Button 
                  onClick={handleDisbandTeam} 
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disband
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
