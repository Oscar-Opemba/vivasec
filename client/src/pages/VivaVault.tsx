import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, AlertTriangle, Plus, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

export default function VivaVault() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [showPasswords, setShowPasswords] = useState(false);
  const { data: passwords } = trpc.vault.getPasswords.useQuery();
  const { data: breachedPasswords } = trpc.vault.getBreachedPasswords.useQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const weakPasswordCount = passwords?.filter(p => p.passwordStrength === "weak" || p.passwordStrength === "fair").length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl font-bold text-white">VivaVault</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Alerts */}
        {breachedPasswords && breachedPasswords.length > 0 && (
          <Card className="bg-red-500/10 border-red-900/50 p-6 mb-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Breached Passwords Detected</h3>
                <p className="text-sm text-slate-300 mb-4">
                  {breachedPasswords.length} of your passwords have been found in data breaches. Update them immediately.
                </p>
                <Button className="bg-red-600 hover:bg-red-700 text-sm">
                  Update Now
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Password List */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Saved Passwords</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {passwords?.slice(0, 8).map((pwd, idx) => (
                  <div key={idx} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{pwd.websiteUrl}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {showPasswords ? pwd.username : "••••••••"}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {pwd.isBreached ? (
                            <>
                              <AlertTriangle className="w-3 h-3 text-red-500" />
                              <span className="text-xs text-red-400">Compromised</span>
                            </>
                          ) : (
                            <>
                              <div className={`w-2 h-2 rounded-full ${
                                pwd.passwordStrength === "strong" ? "bg-green-500" :
                                pwd.passwordStrength === "good" ? "bg-blue-500" :
                                pwd.passwordStrength === "fair" ? "bg-yellow-500" : "bg-red-500"
                              }`}></div>
                              <span className="text-xs text-slate-400 capitalize">{pwd.passwordStrength}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Vault Stats */}
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Vault Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-slate-300">Total Passwords</p>
                    <p className="text-2xl font-bold text-blue-500">{passwords?.length ?? 0}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-slate-300">Strong Passwords</p>
                    <p className="text-2xl font-bold text-green-500">
                      {passwords?.filter(p => p.passwordStrength === "strong").length ?? 0}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-slate-300">Weak Passwords</p>
                    <p className="text-2xl font-bold text-red-500">{weakPasswordCount}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-300">Compromised</p>
                    <p className="text-2xl font-bold text-orange-500">{breachedPasswords?.length ?? 0}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Security Features</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Lock className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">AES-256 Encryption</p>
                    <p className="text-xs text-slate-400">Military-grade security</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">Zero-Knowledge</p>
                    <p className="text-xs text-slate-400">Only you can access</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">Breach Monitoring</p>
                    <p className="text-xs text-slate-400">Real-time alerts</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Tools</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-xs">
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Password
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Audit Passwords
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
