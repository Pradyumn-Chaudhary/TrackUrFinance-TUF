import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction, MOCK_TRANSACTIONS } from "../constants/mockData";

export interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  clearAll: () => void;
  loadDemoData: () => void;
  removeDemoData: () => void;
}

const parseDates = (transactions: any[]): Transaction[] =>
  transactions.map((t) => ({ ...t, date: new Date(t.date) }));

const DEMO_IDS = new Set(MOCK_TRANSACTIONS.map((t) => t.id));

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (t) => {
        const newTx: Transaction = {
          ...t,
          id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          date: new Date(t.date),
        };
        set((state) => ({
          transactions: [newTx, ...state.transactions],
        }));
      },
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },
      clearAll: () => set({ transactions: [] }),
      loadDemoData: () => {
        set((state) => {
          const existingIds = new Set(state.transactions.map((t) => t.id));
          const toAdd = MOCK_TRANSACTIONS.filter((t) => !existingIds.has(t.id));
          if (toAdd.length === 0) return state;
          return { transactions: [...toAdd, ...state.transactions] };
        });
      },
      removeDemoData: () => {
        set((state) => ({
          transactions: state.transactions.filter((t) => !DEMO_IDS.has(t.id)),
        }));
      },
    }),
    {
      name: "tuf-transactions-v2",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ transactions: state.transactions }),
      merge: (persisted: any, current) => ({
        ...current,
        transactions: persisted?.transactions
          ? parseDates(persisted.transactions)
          : [],
      }),
    },
  ),
);
