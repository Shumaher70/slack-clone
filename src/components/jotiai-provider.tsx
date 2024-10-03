"use client";

import { Provider } from "jotai";

interface JotaiProviderProvider {
  children: React.ReactNode;
}

export const JotaiProvider = ({ children }: JotaiProviderProvider) => {
  return <Provider>{children}</Provider>;
};
