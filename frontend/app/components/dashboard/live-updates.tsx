import { useState, useEffect } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Activity, Wifi, WifiOff, Users, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWebSocket } from "~/hooks/useWebSocket";

export function LiveUpdates() {
  const { socket, isConnected } = useWebSocket('ws://localhost:3001');
  const [liveStats, setLiveStats] = useState({
    onlineUsers: 234,
    activeBets: 89,
    nextRaceIn: '00:45:23'
  });

  useEffect(() => {
    if (!socket) return;

    socket.on('userCountUpdate', (data) => {
      setLiveStats(prev => ({
        ...prev,
        onlineUsers: data.connectedUsers
      }));
    });

    // Simuler des mises à jour en temps réel
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        onlineUsers: Math.max(200, prev.onlineUsers + Math.floor(Math.random() * 10 - 5)),
        activeBets: Math.max(50, prev.activeBets + Math.floor(Math.random() * 6 - 3))
      }));
    }, 3000);

    return () => {
      clearInterval(interval);
      socket.off('userCountUpdate');
    };
  }, [socket]);

  return (
    <div className="flex items-center space-x-4">
      {/* Statut de connexion */}
      <div className="flex items-center space-x-2">
        <motion.div
          animate={{ scale: isConnected ? [1, 1.2, 1] : 1 }}
          transition={{ repeat: isConnected ? Infinity : 0, duration: 2 }}
        >
          {isConnected ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
        </motion.div>
        <Badge variant={isConnected ? "default" : "destructive"}>
          {isConnected ? "En ligne" : "Hors ligne"}
        </Badge>
      </div>

      {/* Stats en temps réel */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-green-500" />
          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={liveStats.onlineUsers}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                className="text-sm font-bold"
              >
                {liveStats.onlineUsers}
              </motion.div>
            </AnimatePresence>
            <div className="text-xs text-muted-foreground">En ligne</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={liveStats.activeBets}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                className="text-sm font-bold"
              >
                {liveStats.activeBets}
              </motion.div>
            </AnimatePresence>
            <div className="text-xs text-muted-foreground">Courses actives</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-blue-500" />
          <div className="text-center">
            <div className="text-sm font-bold font-mono">
              {liveStats.nextRaceIn}
            </div>
            <div className="text-xs text-muted-foreground">Prochaine course</div>
          </div>
        </div>
      </div>

      {/* Bouton de rafraîchissement */}
      <Button variant="outline" size="sm" className="hidden sm:flex">
        <Activity className="w-4 h-4 mr-2" />
        Live
      </Button>
    </div>
  );
}
