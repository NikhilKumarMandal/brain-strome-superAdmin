import React, { useState } from "react";
import { Users, Trash2, History, Eye } from "lucide-react";
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
import { disbandTeam, getTeamHistory, seeTeamMembers } from "../http/api";
import { useMutation } from "@tanstack/react-query";
import { timeAgo } from "../utils/formatTime";
import { formateString } from "../utils/formatString";

const disbandUserTeam = async (teamName) => {
  const { data } = await disbandTeam(teamName);
  return data;
};

const getTeamHistoryDetails = async (teamName) => {
  const { data } = await getTeamHistory(teamName);
  return data;
};

const getAllTeamMemberDetails = async (teamName) => {
  const { data } = await seeTeamMembers(teamName);
  return data;
};

const TeamManagement = () => {
  const [disbandTeamName, setDisbandTeamName] = useState("");
  const [history, setHistory] = useState([]);
  const [members, setMembers] = useState([]);

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

  const { mutate: historyMutate, isPending: isHistoryLoading } = useMutation({
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

  const { mutate: MemberMutate, isPending: isMemberLoding } = useMutation({
    mutationKey: ["team-member"],
    mutationFn: getAllTeamMemberDetails,
    onSuccess: (data) => {
      setMembers(data?.data || []);
      toast.success("Team member fetched");
    },
    onError: () => {
      toast.error("Failed to fetch member");
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

  const handleTeamMemberDetails = () => {
    if (!disbandTeamName.trim()) return;
    MemberMutate(disbandTeamName);
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
                <Button
                  onClick={handleTeamMemberDetails}
                  variant="outline"
                  className="text-primary hover:bg-gray-100"
                  disabled={isMemberLoding}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Members
                </Button>
              </div>
            </div>
          </div>

          {history?.length > 0 && (
            <div className="pt-4 space-y-2">
              <h2 className="text-lg font-semibold">Team History</h2>
              <ul className="space-y-3 text-sm text-gray-700">
                {history?.map((item, index) => (
                  <li key={index} className="border p-3 rounded-md shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-600">
                        {formateString(item?.action)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {timeAgo(item?.timestamp)}
                      </span>
                    </div>
                    <div className="mt-1 text-gray-800">{item?.message}</div>
                    {item?.reason && (
                      <div className="mt-1 text-gray-500 text-sm italic">
                        Reason: {item?.reason}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {members && members?.length > 0 && (
            <div className="pt-4 space-y-2">
              <h2 className="text-lg font-semibold">Team Members</h2>
              <ul className="space-y-3 text-sm text-gray-700">
                {members?.map((member, index) => (
                  <li
                    key={index}
                    className="border p-3 rounded-md shadow-sm flex items-center gap-4"
                  >
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                        {member.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">
                        {member?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {member?.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        Role: {formateString(member?.role)}
                      </div>
                    </div>
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
