import { gql } from "@urql/core";
import { urqlClient } from "../urqlClient";
import { db } from "../db/appDB";
import type { StoredFlashing } from "@/types/flashingTypes";
import type { StoredMaterialAndProps } from "@/types/material&PropsType";
import type { Template } from "@/types/templateType";
import type { StoredOrder } from "@/types/orderTypes";
import type { StoredJobReference } from "@/types/jobReferenceTypes";

// GraphQL Mutations and Queries for Sync
export const SYNC_DATA_MUTATION = gql`
  mutation SyncData($input: SyncRequestInput!) {
    syncData(input: $input) {
      success
      data {
        users
        flashings
        templates
        orders
        jobReferences
      }
      conflicts {
        type
        localId
        serverId
        localData
        serverData
      }
      errors
    }
  }
`;

export const SYNC_STATUS_QUERY = gql`
  query GetSyncStatus {
    getSyncStatus {
      lastSyncTime
      pendingChanges
      conflicts
    }
  }
`;

export interface PendingAction {
  type: "user" | "flashing" | "template" | "order" | "jobReference";
  action: "create" | "update" | "delete";
  data: any;
  timestamp: Date;
}

export interface SyncConflict {
  type: string;
  localId: string;
  serverId: string;
  localData: any;
  serverData: any;
}

export interface SyncResult {
  success: boolean;
  data?: {
    users?: any[];
    flashings?: any[];
    templates?: any[];
    orders?: any[];
    jobReferences?: any[];
  };
  conflicts?: SyncConflict[];
  errors?: string[];
}

export class SyncService {
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;
  private lastSyncTime: Date = new Date(0);
  private pendingActions: PendingAction[] = [];

  constructor() {
    // Listen for online/offline events
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        this.isOnline = true;
        this.syncPendingChanges();
      });

      window.addEventListener("offline", () => {
        this.isOnline = false;
      });

      // Load last sync time from localStorage
      const stored = localStorage.getItem("lastSyncTime");
      if (stored) {
        this.lastSyncTime = new Date(stored);
      }

      // Load pending actions from localStorage
      const pending = localStorage.getItem("pendingActions");
      if (pending) {
        this.pendingActions = JSON.parse(pending);
      }
    }
  }

  // Add a pending action to be synced
  addPendingAction(action: PendingAction) {
    this.pendingActions.push(action);
    this.savePendingActions();

    // Try to sync immediately if online
    if (this.isOnline && !this.syncInProgress) {
      this.syncPendingChanges();
    }
  }

  // Get sync status
  async getSyncStatus() {
    try {
      const result = await urqlClient.query(SYNC_STATUS_QUERY, {}).toPromise();

      if (result.error) {
        console.error("Sync status error:", result.error);
        return {
          lastSyncTime: this.lastSyncTime,
          pendingChanges: this.pendingActions.length,
          conflicts: 0,
        };
      }

      return (
        result.data?.getSyncStatus || {
          lastSyncTime: this.lastSyncTime,
          pendingChanges: this.pendingActions.length,
          conflicts: 0,
        }
      );
    } catch (error) {
      console.error("Sync status error:", error);
      return {
        lastSyncTime: this.lastSyncTime,
        pendingChanges: this.pendingActions.length,
        conflicts: 0,
      };
    }
  }

  // Sync pending changes with backend
  async syncPendingChanges(): Promise<SyncResult> {
    if (
      !this.isOnline ||
      this.syncInProgress ||
      this.pendingActions.length === 0
    ) {
      return { success: true };
    }

    this.syncInProgress = true;

    try {
      const result = await urqlClient
        .mutation(SYNC_DATA_MUTATION, {
          input: {
            userId: this.getCurrentUserId(),
            pendingActions: this.pendingActions,
            lastSyncTime: this.lastSyncTime,
          },
        })
        .toPromise();

      if (result.error) {
        console.error("Sync error:", result.error);
        this.syncInProgress = false;
        return { success: false, errors: [result.error.message] };
      }

      const syncResult = result.data?.syncData;
      if (!syncResult) {
        this.syncInProgress = false;
        return { success: false, errors: ["No sync result received"] };
      }

      if (syncResult.success) {
        // Process synced data
        await this.processSyncedData(syncResult.data);

        // Handle conflicts
        if (syncResult.conflicts && syncResult.conflicts.length > 0) {
          await this.handleConflicts(syncResult.conflicts);
        }

        // Clear pending actions
        this.pendingActions = [];
        this.savePendingActions();

        // Update last sync time
        this.lastSyncTime = new Date();
        localStorage.setItem("lastSyncTime", this.lastSyncTime.toISOString());
      }

      this.syncInProgress = false;
      return syncResult;
    } catch (error) {
      console.error("Sync error:", error);
      this.syncInProgress = false;
      return { success: false, errors: ["Network error during sync"] };
    }
  }

  // Process synced data from backend
  private async processSyncedData(data: any) {
    if (!data) return;

    try {
      // Process users
      if (data.users) {
        for (const userStr of data.users) {
          const user = JSON.parse(userStr);
          await db.users.put(user);
        }
      }

      // Process flashings
      if (data.flashings) {
        for (const flashingStr of data.flashings) {
          const flashing = JSON.parse(flashingStr);
          await db.flashings.put(flashing);
        }
      }

      // Process templates
      if (data.templates) {
        for (const templateStr of data.templates) {
          const template = JSON.parse(templateStr);
          await db.templates.put(template);
        }
      }

      // Process orders
      if (data.orders) {
        for (const orderStr of data.orders) {
          const order = JSON.parse(orderStr);
          await db.orders.put(order);
        }
      }

      // Process job references
      if (data.jobReferences) {
        for (const jobRefStr of data.jobReferences) {
          const jobRef = JSON.parse(jobRefStr);
          await db.jobReferences.put(jobRef);
        }
      }
    } catch (error) {
      console.error("Error processing synced data:", error);
    }
  }

  // Handle sync conflicts
  private async handleConflicts(conflicts: SyncConflict[]) {
    // For now, we'll use a simple strategy: server wins
    // In a real implementation, you might want to show a UI for conflict resolution
    for (const conflict of conflicts) {
      try {
        const serverData = JSON.parse(conflict.serverData);

        switch (conflict.type) {
          case "user":
            await db.users.put(serverData);
            break;
          case "flashing":
            await db.flashings.put(serverData);
            break;
          case "template":
            await db.templates.put(serverData);
            break;
          case "order":
            await db.orders.put(serverData);
            break;
          case "jobReference":
            await db.jobReferences.put(serverData);
            break;
        }
      } catch (error) {
        console.error("Error resolving conflict:", error);
      }
    }
  }

  // Get current user ID
  private getCurrentUserId(): string {
    if (typeof window === "undefined") return "";

    const userStr = localStorage.getItem("user");
    if (!userStr) return "";

    try {
      const user = JSON.parse(userStr);
      return user._id || "";
    } catch {
      return "";
    }
  }

  // Save pending actions to localStorage
  private savePendingActions() {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "pendingActions",
        JSON.stringify(this.pendingActions)
      );
    }
  }

  // Force sync (for manual sync button)
  async forceSync(): Promise<SyncResult> {
    return this.syncPendingChanges();
  }

  // Check if sync is in progress
  isSyncInProgress(): boolean {
    return this.syncInProgress;
  }

  // Get pending actions count
  getPendingActionsCount(): number {
    return this.pendingActions.length;
  }

  // Check if online
  isOnlineStatus(): boolean {
    return this.isOnline;
  }
}

// Export singleton instance
export const syncService = new SyncService();
