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
    <div>
      <div>
        <input
          type="text"
          placeholder="Pergunte algo"
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
      <input type="file" id="fileInput" multiple accept=".pdf" />
    </div>
  );
}
export default Input;
