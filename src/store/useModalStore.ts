import { create } from "zustand";

interface ModalState {
  isAddTransactionVisible: boolean;
  openAddTransaction: () => void;
  closeAddTransaction: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isAddTransactionVisible: false,
  openAddTransaction: () => set({ isAddTransactionVisible: true }),
  closeAddTransaction: () => set({ isAddTransactionVisible: false }),
}));
