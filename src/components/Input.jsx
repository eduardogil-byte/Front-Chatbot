import { useState } from "react";

function Input({ onSendMessage }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto bg-[#1e1e1e] rounded-3xl pb-5 shadow-lg">
      <div className="flex items-center gap-2 px-3 py-2">
        <input
          type="text"
          value={input}
          placeholder="Pergunte algo"
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent text-gray-200 outline-none placeholder-gray-400 p-2"
        />
        <button
          onClick={handleSend}
          className="bg-[#303030] hover:bg-[#404040] text-gray-200 px-4 py-2 rounded-full transition-colors text-sm font-medium"
        >
          Enviar
        </button>
      </div>

      <div>
        <label
          htmlFor="file-upload"
          className="text-xs text-gray-400 hover:text-gray-200 cursor-pointer flex items-center transition-colors px-3"
        >
          📎 Adicionar arquivo
        </label>
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".pdf"
          className="hidden"
        />
      </div>
    </div>
  );
}
export default Input;
