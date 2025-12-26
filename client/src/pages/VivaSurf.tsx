import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, Shield, Zap, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

export default function VivaSurf() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [url, setUrl] = useState("https://example.com");
  const { data: trackerStats } = trpc.browser.getTrackerStats.useQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const totalTrackersBlocked = trackerStats?.reduce((sum, t) => sum + t.blockCount, 0) ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-purple-500" />
            <h1 className="text-2xl font-bold text-white">VivaSurf</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Browser Bar */}
        <Card className="bg-slate-800/50 border-slate-700 p-4 mb-6">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-slate-700 rounded-lg px-3">
              <Shield className="w-4 h-4 text-green-500" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-transparent border-0 text-white placeholder-slate-400 focus:outline-none"
                placeholder="Enter URL..."
              />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">Navigate</Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Browser Preview */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 h-96 flex items-center justify-center">
              <div className="text-center">
                <Eye className="w-16 h-16 mx-auto mb-4 text-purple-500 opacity-50" />
                <p className="text-slate-400">Browser preview area</p>
                <p className="text-xs text-slate-500 mt-2">Trackers and ads blocked in real-time</p>
              </div>
            </Card>
          </div>

          {/* Stats Panel */}
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Protection Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-slate-300">Trackers Blocked</p>
                    <p className="text-2xl font-bold text-green-500">{totalTrackersBlocked}</p>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-slate-300">Ads Blocked</p>
                    <p className="text-2xl font-bold text-blue-500">234</p>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-slate-300">Fingerprinting Blocked</p>
                    <p className="text-2xl font-bold text-orange-500">89</p>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Security Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-300">HTTPS Enforced</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-300">DoH/DoT Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-slate-300">Anti-Fingerprinting</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Top Trackers */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-white mb-4">Top Blocked Trackers</h2>
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="divide-y divide-slate-700">
              {trackerStats?.slice(0, 5).map((tracker, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{tracker.trackerDomain}</p>
                    <p className="text-xs text-slate-400 capitalize">{tracker.trackerType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-500">{tracker.blockCount}</p>
                    <p className="text-xs text-slate-400">blocks</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
