"use client";

import React, { useState, useEffect } from "react";
import { syncService } from "@/lib/sync/syncService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

interface SyncStatusProps {
  className?: string;
}

export function SyncStatus({ className = "" }: SyncStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncInProgress, setIsSyncInProgress] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<any>(null);

  useEffect(() => {
    // Initial status
    updateStatus();

    // Set up interval to check status
    const interval = setInterval(updateStatus, 5000);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const updateStatus = async () => {
    setIsOnline(syncService.isOnlineStatus());
    setIsSyncInProgress(syncService.isSyncInProgress());
    setPendingCount(syncService.getPendingActionsCount());

    try {
      const status = await syncService.getSyncStatus();
      setSyncStatus(status);
      setLastSyncTime(status.lastSyncTime);
    } catch (error) {}
  };

  const handleForceSync = async () => {
    setIsSyncInProgress(true);
    try {
      const result = await syncService.forceSync();
      if (result.success) {
      } else {
      }
    } catch (error) {
    } finally {
      setIsSyncInProgress(false);
      updateStatus();
    }
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return "Never";

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getStatusColor = () => {
    if (!isOnline) return "destructive";
    if (isSyncInProgress) return "secondary";
    if (pendingCount > 0) return "warning";
    return "default";
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4" />;
    if (isSyncInProgress) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (pendingCount > 0) return <Clock className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (!isOnline) return "Offline";
    if (isSyncInProgress) return "Syncing...";
    if (pendingCount > 0) return `${pendingCount} pending`;
    return "Synced";
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Status Badge */}
      <Badge variant={getStatusColor()} className="flex items-center gap-1">
        {getStatusIcon()}
        <span className="text-xs">{getStatusText()}</span>
      </Badge>

      {/* Last Sync Time */}
      {lastSyncTime && (
        <span className="text-xs text-muted-foreground">
          Last sync: {formatLastSync(lastSyncTime)}
        </span>
      )}

      {/* Force Sync Button */}
      {isOnline && pendingCount > 0 && !isSyncInProgress && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleForceSync}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Sync
        </Button>
      )}

      {/* Sync Progress Indicator */}
      {isSyncInProgress && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <RefreshCw className="h-3 w-3 animate-spin" />
          <span>Syncing...</span>
        </div>
      )}

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="flex items-center gap-1 text-xs text-destructive">
          <WifiOff className="h-3 w-3" />
          <span>Working offline</span>
        </div>
      )}
    </div>
  );
}

// Hook for using sync status in components
export function useSyncStatus() {
  const [status, setStatus] = useState({
    isOnline: true,
    isSyncInProgress: false,
    pendingCount: 0,
    lastSyncTime: null as Date | null,
  });

  useEffect(() => {
    const updateStatus = () => {
      setStatus({
        isOnline: syncService.isOnlineStatus(),
        isSyncInProgress: syncService.isSyncInProgress(),
        pendingCount: syncService.getPendingActionsCount(),
        lastSyncTime: null, // This would need to be fetched from sync service
      });
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return status;
}
