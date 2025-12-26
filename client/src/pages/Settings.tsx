import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Settings as SettingsIcon, User, Bell, Lock, Shield, LogOut, Download, Trash2, Eye, EyeOff } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Settings() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"account" | "privacy" | "notifications" | "security">("account");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("account")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                    activeTab === "account"
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <User className="w-4 h-4" />
                  Account
                </button>
                <button
                  onClick={() => setActiveTab("privacy")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                    activeTab === "privacy"
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Privacy
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                    activeTab === "notifications"
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                    activeTab === "security"
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  Security
                </button>
              </nav>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Account Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-300 block mb-2">Full Name</label>
                      <Input
                        value={user?.name || ""}
                        readOnly
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-2">Email Address</label>
                      <Input
                        value={user?.email || ""}
                        readOnly
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-2">Account Type</label>
                      <Input
                        value={user?.role === "admin" ? "Administrator" : "User"}
                        readOnly
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-2">Member Since</label>
                      <Input
                        value={new Date(user?.createdAt || "").toLocaleDateString()}
                        readOnly
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Data Management</h2>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export My Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Session</h2>
                  <Button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </Card>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Privacy Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { title: "VivaChat", desc: "End-to-end encrypted messaging" },
                      { title: "VivaSurf", desc: "Privacy-focused browsing" },
                      { title: "VivaConnect", desc: "VPN and network protection" },
                      { title: "VivaMail", desc: "Secure email encryption" },
                      { title: "VivaVault", desc: "Password vault protection" },
                    ].map((module) => (
                      <div key={module.title} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div>
                          <p className="text-sm font-semibold text-white">{module.title}</p>
                          <p className="text-xs text-slate-400">{module.desc}</p>
                        </div>
                        <div className="w-10 h-6 bg-green-600 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Data Collection</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div>
                        <p className="text-sm font-semibold text-white">Analytics</p>
                        <p className="text-xs text-slate-400">Help us improve with usage data</p>
                      </div>
                      <div className="w-10 h-6 bg-slate-600 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div>
                        <p className="text-sm font-semibold text-white">Crash Reports</p>
                        <p className="text-xs text-slate-400">Send diagnostic information</p>
                      </div>
                      <div className="w-10 h-6 bg-green-600 rounded-full"></div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Alert Notifications</h2>
                  <div className="space-y-4">
                    {[
                      { title: "Critical Alerts", desc: "Immediate threats and breaches", enabled: true },
                      { title: "High Priority", desc: "Important security events", enabled: true },
                      { title: "Medium Priority", desc: "Moderate security concerns", enabled: true },
                      { title: "Low Priority", desc: "General information and tips", enabled: false },
                    ].map((alert) => (
                      <div key={alert.title} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div>
                          <p className="text-sm font-semibold text-white">{alert.title}</p>
                          <p className="text-xs text-slate-400">{alert.desc}</p>
                        </div>
                        <div className={`w-10 h-6 rounded-full ${alert.enabled ? "bg-green-600" : "bg-slate-600"}`}></div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Notification Channels</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div>
                        <p className="text-sm font-semibold text-white">In-App Notifications</p>
                        <p className="text-xs text-slate-400">Show alerts in the app</p>
                      </div>
                      <div className="w-10 h-6 bg-green-600 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div>
                        <p className="text-sm font-semibold text-white">Email Notifications</p>
                        <p className="text-xs text-slate-400">Send alerts to your email</p>
                      </div>
                      <div className="w-10 h-6 bg-green-600 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div>
                        <p className="text-sm font-semibold text-white">Push Notifications</p>
                        <p className="text-xs text-slate-400">Mobile push alerts</p>
                      </div>
                      <div className="w-10 h-6 bg-slate-600 rounded-full"></div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Encryption Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-300 block mb-2">Master Password</label>
                      <div className="flex gap-2">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••••••"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">Used to encrypt all your sensitive data</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Security Features</h2>
                  <div className="space-y-4">
                    {[
                      { title: "Two-Factor Authentication", desc: "Add an extra layer of security", enabled: false },
                      { title: "Biometric Login", desc: "Use fingerprint or face recognition", enabled: false },
                      { title: "Session Timeout", desc: "Auto-logout after 30 minutes", enabled: true },
                      { title: "Login Alerts", desc: "Get notified of new logins", enabled: true },
                    ].map((feature) => (
                      <div key={feature.title} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div>
                          <p className="text-sm font-semibold text-white">{feature.title}</p>
                          <p className="text-xs text-slate-400">{feature.desc}</p>
                        </div>
                        <div className={`w-10 h-6 rounded-full ${feature.enabled ? "bg-green-600" : "bg-slate-600"}`}></div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Active Sessions</h2>
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-white">Current Session</p>
                        <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">Active</span>
                      </div>
                      <p className="text-xs text-slate-400">Chrome on macOS • Last active: now</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
