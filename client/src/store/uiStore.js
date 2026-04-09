import { create } from "zustand";

/**
 * UI state store.
 */
export const useUiStore = create((set) => ({
	isSidebarCollapsed: false,
	setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),
	toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));

