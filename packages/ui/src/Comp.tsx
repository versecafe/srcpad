import { createSignal, onCleanup, onMount } from "solid-js";

export function CodeCell() {
  const [socket, setSocket] = createSignal<WebSocket | null>(null);
  const [sourceCode, setSourceCode] = createSignal("");
  const [output, setOutput] = createSignal({ stdout: "", stderr: "" });

  onMount(() => {
    const ws = new WebSocket("ws://localhost:2150/ws");
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "cell:run:result") {
        setOutput(data.payload);
      }
    };

    onCleanup(() => {
      ws.close();
    });
  });

  const handleRunCode = () => {
    if (socket()) {
      const message = {
        topic: "session:123",
        event: "cell:run",
        payload: { source: sourceCode() },
      };
      socket().send(JSON.stringify(message));
    }
  };

  return (
    <div class="max-w-2xl mx-auto p-2 bg-gray-800 rounded-lg w-full">
      <textarea
        class="w-full p-3 mb-4 bg-gray-950 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
        value={sourceCode()}
        onInput={(e) => setSourceCode(e.target.value)}
        rows={10}
      />
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        onClick={handleRunCode}
      >
        Run Code
      </button>
      <div class="mt-6">
        <h3 class="text-xl font-semibold text-red-400 mb-2">Output:</h3>
        <div class="bg-gray-900 p-4 rounded">
          <pre class="text-green-400">stdout: {output().stdout}</pre>
          <pre class="text-red-400">stderr: {output().stderr}</pre>
        </div>
      </div>
    </div>
  );
}
