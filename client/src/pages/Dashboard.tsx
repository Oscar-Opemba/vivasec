import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Shield, Zap, Lock, Eye, Wifi, Settings as SettingsIcon } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data: privacyScore } = trpc.privacy.getScore.useQuery();
  const { data: alerts } = trpc.privacy.getAlerts.useQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const score = privacyScore?.score ?? 85;
  const scoreColor = score >= 90 ? "text-green-500" : score >= 70 ? "text-yellow-500" : "text-red-500";
  const scoreBg = score >= 90 ? "bg-green-500/10" : score >= 70 ? "bg-yellow-500/10" : "bg-red-500/10";

  const modules = [
    { name: "VivaChat", icon: Shield, color: "from-blue-500 to-cyan-500", path: "/messaging" },
    { name: "VivaSurf", icon: Eye, color: "from-purple-500 to-pink-500", path: "/browser" },
    { name: "VivaConnect", icon: Wifi, color: "from-green-500 to-emerald-500", path: "/vpn" },
    { name: "VivaMail", icon: Lock, color: "from-orange-500 to-red-500", path: "/email" },
    { name: "VivaVault", icon: Zap, color: "from-indigo-500 to-blue-500", path: "/vault" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">VivaSec Privacy Dashboard</h1>
            <p className="text-slate-400 mt-1">Welcome back, {user?.name || "User"}</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/settings")}>
            <SettingsIcon className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Privacy Score Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Central Privacy Score Gauge */}
          <Card className="lg:col-span-1 bg-slate-800/50 border-slate-700 p-8 flex flex-col items-center justify-center">
            <div className={`relative w-32 h-32 rounded-full ${scoreBg} flex items-center justify-center`}>
              <div className="text-center">
                <div className={`text-5xl font-bold ${scoreColor}`}>{score}</div>
                <div className="text-xs text-slate-400 mt-1">Privacy Score</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-300">
                {score >= 90 ? "Excellent" : score >= 70 ? "Good" : "Needs Attention"}
              </p>
              <p className="text-xs text-slate-500 mt-2">Based on all your privacy modules</p>
            </div>
          </Card>

          {/* Module Status Overview */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {modules.map((module) => (
              <Card
                key={module.name}
                className="bg-slate-800/50 border-slate-700 p-4 cursor-pointer hover:border-slate-600 transition-colors"
                onClick={() => navigate(module.path)}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center mb-3`}>
                  <module.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white">{module.name}</h3>
                <p className="text-xs text-slate-400 mt-1">Active & Protected</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Alerts Section */}
        {alerts && alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Active Alerts</h2>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <Card key={alert.id} className="bg-slate-800/50 border-slate-700 p-4 flex items-start gap-4">
                  <AlertCircle className={`w-5 h-5 mt-1 flex-shrink-0 ${
                    alert.severity === "critical" ? "text-red-500" :
                    alert.severity === "high" ? "text-orange-500" :
                    alert.severity === "medium" ? "text-yellow-500" : "text-blue-500"
                  }`} />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">{alert.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{alert.description}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    Fix
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-auto py-4 flex flex-col items-center justify-center">
              <Shield className="w-5 h-5 mb-2" />
              <span className="text-xs">Enable VPN</span>
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white h-auto py-4 flex flex-col items-center justify-center">
              <Lock className="w-5 h-5 mb-2" />
              <span className="text-xs">Audit Passwords</span>
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white h-auto py-4 flex flex-col items-center justify-center">
              <Eye className="w-5 h-5 mb-2" />
              <span className="text-xs">Block Trackers</span>
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white h-auto py-4 flex flex-col items-center justify-center">
              <Zap className="w-5 h-5 mb-2" />
              <span className="text-xs">Check Breaches</span>
            </Button>
          </div>
        </div>

        {/* Module Grid */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Privacy Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {modules.map((module) => (
              <Card
                key={module.name}
                className="bg-slate-800/50 border-slate-700 p-6 cursor-pointer hover:border-slate-600 hover:bg-slate-800/70 transition-all"
                onClick={() => navigate(module.path)}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center mb-4`}>
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{module.name}</h3>
                <p className="text-xs text-slate-400 mb-4">Secure & Protected</p>
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Open
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
