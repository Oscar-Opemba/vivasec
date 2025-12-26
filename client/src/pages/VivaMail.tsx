import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Lock, AlertTriangle, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";

export default function VivaMail() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { data: aliases } = trpc.email.getAliases.useQuery();
  const { data: quarantined } = trpc.email.getQuarantined.useQuery();

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
            <Mail className="w-6 h-6 text-orange-500" />
            <h1 className="text-2xl font-bold text-white">VivaMail</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Inbox */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Inbox</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">sender@example.com</p>
                        <p className="text-sm text-slate-300 mt-1">Email subject line here</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Lock className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-400">E2EE Encrypted</span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">2h ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {quarantined && quarantined.length > 0 && (
              <Card className="bg-slate-800/50 border-red-900/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-white">Quarantined ({quarantined.length})</h3>
                </div>
                <div className="space-y-3">
                  {quarantined.slice(0, 3).map((email, idx) => (
                    <div key={idx} className="p-4 bg-red-500/10 rounded-lg border border-red-900/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">{email.senderEmail}</p>
                          <p className="text-sm text-slate-300 mt-1">{email.subject}</p>
                          <p className="text-xs text-red-400 mt-2">Threat: {email.threatType}</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Aliases & Settings */}
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Anonymous Aliases</h3>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {aliases?.slice(0, 3).map((alias, idx) => (
                  <div key={idx} className="p-3 bg-slate-700/50 rounded-lg">
                    <p className="text-xs font-mono text-green-400">{alias.aliasEmail}</p>
                    <p className="text-xs text-slate-400 mt-1">Active</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Security Features</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Lock className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">E2EE Encryption</p>
                    <p className="text-xs text-slate-400">OpenPGP standard</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">Phishing Detection</p>
                    <p className="text-xs text-slate-400">ML-powered scanning</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Email Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">Total Emails</span>
                  <span className="text-white font-semibold">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">E2EE Emails</span>
                  <span className="text-green-400 font-semibold">142</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Threats Blocked</span>
                  <span className="text-orange-400 font-semibold">8</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
