import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stats } from "../http/api";
import { Users, Ticket, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const matrix = async () => {
  const { data } = await stats().then((res) => res.data);
  return data;
};

function StatsPage() {
  const { data: statsData } = useQuery({
    queryKey: ["stats"],
    queryFn: matrix,
  });

  const formatBytes = (bytes) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const formatUptime = (uptime) => {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className=" bg-gradient-to-br p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            SuperAdmin Dashboard
          </h1>
          <p className="text-slate-600">
            Overview of system statistics and metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Users
              </CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {statsData?.stats?.totalUsers}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Active registered users
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Tickets
              </CardTitle>
              <Ticket className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {statsData?.stats?.totalTickets}
              </div>
              <p className="text-xs text-slate-500 mt-1">Tickets created</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Team
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {statsData?.stats?.totalTeams}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Total team create in chorot
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Discussion
              </CardTitle>
              <BarChart3 className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {statsData?.stats?.totalDiscussions}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Most Active User
              </CardTitle>
              <Calendar className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-1xl font-bold text-slate-900">
                {statsData?.stats?.mostActiveUser.name}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                active user by discussion
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Database</span>
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        statsData?.health?.database === "connected"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span
                      className={`text-sm font-medium ${
                        statsData?.health?.database === "connected"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {statsData?.health?.database}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Server Time</span>
                  <span className="text-sm text-slate-800">
                    {new Date(statsData?.health?.serverTime).toLocaleString(
                      "en-IN",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Uptime</span>
                  <span className="text-sm text-slate-800">
                    {formatUptime(statsData?.health?.uptime || 0)}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm text-slate-600">Memory Usage</span>
                  <div className="grid grid-cols-2 gap-x-4 text-sm text-slate-800">
                    <div className="flex justify-between">
                      <span>RSS</span>
                      <span>
                        {formatBytes(statsData?.health?.memory?.rss || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Heap Used</span>
                      <span>
                        {formatBytes(statsData?.health?.memory?.heapUsed || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Heap Total</span>
                      <span>
                        {formatBytes(statsData?.health?.memory?.heapTotal || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>External</span>
                      <span>
                        {formatBytes(statsData?.health?.memory?.external || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
