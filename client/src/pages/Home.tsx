import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Shield, Lock, Eye, Wifi, Mail, Zap } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold">VivaSec</span>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Privacy Operating System
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            VivaSec is a unified privacy super-app that protects every aspect of your digital life. Encrypted messaging, secure browsing, VPN, email, and password management—all in one place.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg">
            <a href={getLoginUrl()}>Get Started Free</a>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Comprehensive Privacy Protection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Lock,
              title: "VivaChat",
              description: "End-to-end encrypted messaging with self-destruct messages and screenshot detection",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: Eye,
              title: "VivaSurf",
              description: "Privacy-focused browser that blocks trackers, ads, and prevents fingerprinting",
              color: "from-purple-500 to-pink-500",
            },
            {
              icon: Wifi,
              title: "VivaConnect",
              description: "One-tap VPN with automatic Wi-Fi protection and strict no-log policy",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: Mail,
              title: "VivaMail",
              description: "Encrypted email with phishing detection and anonymous alias generation",
              color: "from-orange-500 to-red-500",
            },
            {
              icon: Zap,
              title: "VivaVault",
              description: "Zero-knowledge password vault with breach monitoring and autofill integration",
              color: "from-indigo-500 to-blue-500",
            },
            {
              icon: Shield,
              title: "Privacy Dashboard",
              description: "Real-time privacy score, actionable recommendations, and gamified improvements",
              color: "from-rose-500 to-pink-500",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 hover:bg-slate-800/70 transition-all"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose VivaSec?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {[
            { title: "Zero-Knowledge Architecture", desc: "Your data is encrypted locally. We never have access to your sensitive information." },
            { title: "Open-Source & Transparent", desc: "Built with open-source protocols and regular security audits for your peace of mind." },
            { title: "Real-Time Protection", desc: "Instant alerts for suspicious activity, trackers, data leaks, and security threats." },
            { title: "Gamified Privacy", desc: "Earn streaks and badges as you maintain excellent privacy practices." },
            { title: "Cross-Platform Support", desc: "Seamlessly protect your privacy across Android, iOS, Windows, and macOS." },
            { title: "Unified Dashboard", desc: "See your complete privacy posture with actionable recommendations in one place." },
          ].map((benefit, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-slate-400">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Take Control of Your Privacy Today</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust VivaSec to protect their digital life. Start your free trial now.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg">
            <a href={getLoginUrl()}>Start Free Trial</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-slate-400 text-sm">
          <p>&copy; 2025 VivaSec. Your privacy is our priority.</p>
        </div>
      </footer>
    </div>
  );
}
