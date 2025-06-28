import React, { useState } from "react";
import { Users, Trash2, History } from "lucide-react";
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
import { disbandTeam, getTeamHistory } from "../http/api";
import { useMutation } from "@tanstack/react-query";

const disbandUserTeam = async (teamName) => {
  const { data } = await disbandTeam(teamName);
  return data;
};

const getTeamHistoryDetails = async (teamName) => {
  const { data } = await getTeamHistory(teamName);
  return data;
};

const TeamManagement = () => {
  const [disbandTeamName, setDisbandTeamName] = useState("");
  const [history, setHistory] = useState([]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["team-disband"],
    mutationFn: disbandUserTeam,
    onSuccess: () => {
      toast.success("Team Disbanded");
      setDisbandTeamName("");
    },
    onError: () => {
      toast.error("Failed to disband team");
    },
  });

  const {
    data,
    mutate: historyMutate,
    isPending: isHistoryLoading,
  } = useMutation({
    mutationKey: ["team-history"],
    mutationFn: getTeamHistoryDetails,
    onSuccess: (data) => {
      setHistory(data?.data || []);
      toast.success("Team history fetched");
    },
    onError: () => {
      toast.error("Failed to fetch history");
    },
  });

  const handleDisbandTeam = () => {
    if (!disbandTeamName.trim()) return;
    mutate(disbandTeamName);
  };

  const handleGetHistory = () => {
    if (!disbandTeamName.trim()) return;
    historyMutate(disbandTeamName);
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
                  onKeyDown={(e) => e.key === "Enter" && handleDisbandTeam()}
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
                <Button
                  onClick={handleGetHistory}
                  variant="outline"
                  className="text-primary hover:bg-gray-100"
                  disabled={isHistoryLoading}
                >
                  <History className="h-4 w-4 mr-1" />
                  History
                </Button>
              </div>
            </div>
          </div>

          {history.length > 0 && (
            <div className="pt-4 space-y-2">
              <h2 className="text-lg font-semibold">Team History</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {history.map((item, index) => (
                  <li key={index}>
                    <strong>{item.action}</strong> - {item.reason} (
                    {new Date(item.createdAt).toLocaleString()})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
