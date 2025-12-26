import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Lock, Trash2, Eye } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function VivaChat() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now(),
          content: newMessage,
          sender: "You",
          encrypted: true,
          timestamp: new Date(),
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">VivaChat</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 h-96 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No messages yet. Start a secure conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="flex justify-end">
                      <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs">
                        <p className="text-sm">{msg.content}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs opacity-70">
                          <Lock className="w-3 h-3" />
                          E2EE Encrypted
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="border-t border-slate-700 p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a secure message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                  <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Features Panel */}
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Security Features</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">End-to-End Encryption</p>
                    <p className="text-xs text-slate-400">All messages encrypted with Signal Protocol</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Trash2 className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">Self-Destruct Messages</p>
                    <p className="text-xs text-slate-400">Messages auto-delete after viewing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">Screenshot Detection</p>
                    <p className="text-xs text-slate-400">Instant alerts when screenshots are taken</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Message Options</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-xs">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Set Self-Destruct Timer
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs">
                  <Eye className="w-4 h-4 mr-2" />
                  View Screenshot Alerts
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
