import React, { useState } from "react";
import { Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { disbandTeam } from "../http/api";
import { useMutation } from "@tanstack/react-query";

const disbandUserTeam = async (teamName) => {
  const { data } = await disbandTeam(teamName);
  return data;
};

const TeamManagement = () => {
  const [disbandTeamName, setDisbandTeamName] = useState("");

  const { mutate, isPending } = useMutation({
    mutationKey: ["team"],
    mutationFn: disbandUserTeam,
    onSuccess: () => {
      toast.success("Team Disband");
    },
  });

  const handleDisbandTeam = () => {
    if (!disbandTeamName.trim()) return;
    mutate(disbandTeamName);
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
                  onKeyPress={(e) => e.key === "Enter" && handleDisbandTeam()}
                />
                <Button
                  onClick={handleDisbandTeam}
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={isPending}
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
