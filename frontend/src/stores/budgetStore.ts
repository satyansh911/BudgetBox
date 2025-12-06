import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BudgetData, SyncStatus } from '@/types/budget';
import { storage } from '@/lib/storage';
import { api } from '@/lib/api';

interface BudgetStore {
  currentBudget: BudgetData | null;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncError: string | null;
  
  setBudget: (budget: BudgetData) => void;
  updateBudgetField: (field: keyof BudgetData, value: any) => Promise<void>;
  setOnlineStatus: (status: boolean) => void;
  syncToServer: () => Promise<void>;
  loadBudget: (month: string) => Promise<void>;
  reset: () => void;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      currentBudget: null,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      isSyncing: false,
      lastSyncError: null,

      setBudget: (budget) => {
        set({ currentBudget: budget });
        storage.saveBudget(budget);
      },

      updateBudgetField: async (field, value) => {
        const current = get().currentBudget;
        if (!current) return;

        const updated: BudgetData = {
          ...current,
          [field]: value,
          updatedAt: new Date(),
          syncStatus: 'pending',
        };

        set({ currentBudget: updated });
        await storage.saveBudget(updated);

        if (get().isOnline) {
          setTimeout(() => get().syncToServer(), 1000);
        }
      },

      setOnlineStatus: (status) => {
        set({ isOnline: status });
        if (status && get().currentBudget?.syncStatus === 'pending') {
          get().syncToServer();
        }
      },

      syncToServer: async () => {
        const { currentBudget, isOnline, isSyncing } = get();
        
        if (!currentBudget || !isOnline || isSyncing) return;

        set({ isSyncing: true, lastSyncError: null });

        try {
          const result = await api.syncBudget(currentBudget);
          
          const synced: BudgetData = {
            ...currentBudget,
            syncStatus: 'synced',
            lastSyncedAt: new Date(result.timestamp),
          };

          set({ currentBudget: synced, isSyncing: false });
          await storage.saveBudget(synced);
        } catch (error) {
          set({ 
            isSyncing: false, 
            lastSyncError: error instanceof Error ? error.message : 'Sync failed' 
          });
        }
      },

      loadBudget: async (month) => {
        const localBudget = await storage.getBudget(month);
        
        if (localBudget) {
          set({ currentBudget: localBudget });
        }

        if (get().isOnline) {
          try {
            const serverBudget = await api.getLatestBudget(month);
            
            if (!localBudget || new Date(serverBudget.updatedAt!) > new Date(localBudget.updatedAt!)) {
              set({ currentBudget: serverBudget });
              await storage.saveBudget(serverBudget);
            }
          } catch (error) {
            console.error('Failed to fetch from server:', error);
          }
        }

        if (!get().currentBudget) {
          const newBudget: BudgetData = {
            userId: localStorage.getItem('userId') || '',
            month,
            income: 0,
            monthlyBills: 0,
            food: 0,
            transport: 0,
            subscriptions: 0,
            miscellaneous: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            syncStatus: 'local',
          };
          set({ currentBudget: newBudget });
          await storage.saveBudget(newBudget);
        }
      },

      reset: () => {
        set({
          currentBudget: null,
          isSyncing: false,
          lastSyncError: null,
        });
      },
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);