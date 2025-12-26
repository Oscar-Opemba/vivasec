import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wifi, Globe, Lock, Activity } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

export default function VivaConnect() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const { data: vpnStatus } = trpc.vpn.getStatus.useQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wifi className="w-6 h-6 text-green-500" />
            <h1 className="text-2xl font-bold text-white">VivaConnect</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* VPN Status */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700 p-8">
            <div className="flex flex-col items-center justify-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
                isConnected ? "bg-green-500/20" : "bg-slate-700"
              }`}>
                <Wifi className={`w-12 h-12 ${isConnected ? "text-green-500" : "text-slate-400"}`} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {isConnected ? "Connected" : "Disconnected"}
              </h2>
              <p className="text-slate-400 mb-8">
                {isConnected ? "Your connection is secure" : "Click to activate VPN"}
              </p>
              <Button
                size="lg"
                className={`px-12 py-6 text-lg font-semibold ${
                  isConnected
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                onClick={() => setIsConnected(!isConnected)}
              >
                {isConnected ? "Disconnect VPN" : "Connect VPN"}
              </Button>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Connection Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Connection Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <span className="text-slate-300">Server Location</span>
                  <span className="text-white font-semibold">{isConnected ? "New York, USA" : "Not Connected"}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <span className="text-slate-300">IP Address</span>
                  <span className="text-white font-semibold">{isConnected ? "203.0.113.45" : "Hidden"}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <span className="text-slate-300">Protocol</span>
                  <span className="text-white font-semibold">WireGuard</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Data Usage</span>
                  <span className="text-white font-semibold">{isConnected ? "245 MB" : "0 MB"}</span>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Server Selection</h3>
              <div className="space-y-2">
                {["New York, USA", "London, UK", "Tokyo, Japan", "Sydney, Australia"].map((location) => (
                  <Button
                    key={location}
                    variant="outline"
                    className="w-full justify-start text-sm"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    {location}
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Settings Panel */}
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-slate-300">Auto Wi-Fi Protection</span>
                  </div>
                  <div className="w-10 h-6 bg-green-600 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-slate-300">Kill Switch</span>
                  </div>
                  <div className="w-10 h-6 bg-green-600 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-slate-300">Split Tunneling</span>
                  </div>
                  <div className="w-10 h-6 bg-slate-600 rounded-full"></div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Policy</h3>
              <div className="space-y-2 text-xs text-slate-400">
                <p>✓ Strict No-Log Policy</p>
                <p>✓ Military-Grade Encryption</p>
                <p>✓ 24/7 Threat Protection</p>
                <p>✓ Global Server Network</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
