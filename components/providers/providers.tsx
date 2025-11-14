"use client";

import { Provider } from "react-redux";
import { persistor, store } from "@/redux/store/store";
import { ThemeProvider } from "./theme-provider";
import { PersistGate } from "redux-persist/integration/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </PersistGate>
  </Provider>
  )
}
