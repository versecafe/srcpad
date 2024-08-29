import type { Component } from "solid-js";
import { CodeCell } from "./cell";

export const App: Component = () => {
  return (
    <main class="h-screen bg-black text-white flex items-center justify-center">
      <CodeCell />
    </main>
  );
};
