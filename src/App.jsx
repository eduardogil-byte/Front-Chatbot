import { useState } from "react";
import Input from "./components/Input";
import Message from "./components/Message";
function App() {
  const [chatHistory, setChatHistory] = useState([
    { role: "bot", text: "Olá como posso te ajudar hoje?" },
  ]);

  const addNewMessage = (userText) => {
    const newUserMsg = { role: "user", text: userText };

    setChatHistory((prev) => [...prev, newUserMsg]);

    //conectar com a api
    setTimeout(() => {
      const botReply = { role: "bot", text: "Mensagem automatica" };
      setChatHistory((prev) => [...prev, botReply]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#131314] font-sans">
      <div className="flex-1 overflow-y-auto p-4 w-full max-w-4xl mx-auto flex flex-col">
        {chatHistory.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}
      </div>

      <div className="w-full p-4 pb-8">
        <Input onSendMessage={addNewMessage} />
        <p className="text-center text-xs text-gray-500 mt-3">
          O Gemini pode apresentar informações imprecisas. Considere verificar
          as informações importantes. Não coloque nenhum dado sensível.
        </p>
      </div>
    </div>
  );
}

export default App;
