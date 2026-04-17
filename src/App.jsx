import { useState } from "react";
import Input from "./components/Input";
import Message from "./components/Message";

function TypingIndicator() {
  return (
    <div className="flex w-full mb-4 justify-start">
      <div className="bg-transparent px-4 py-3 flex gap-1.5 items-center h-8 mt-1">
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
}

function App() {
  const [chatHistory, setChatHistory] = useState([
    { role: "bot", text: "Olá como posso te ajudar hoje?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "http://localhost:8000";

  const treinarAPI = async (formData) => {
    console.log("dentro de api");

    try {
      const response = await fetch(`${API_URL}/treinar`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Tudo certo");
      } else {
        console.log(`Erro dentro de try: ${JSON.stringify(data.detail)} `);
      }
    } catch (e) {
      console.error(`Erro: ${e}`);
    }
  };

  const respostaAPI = async (pergunta) => {
    console.log("dentro de resposta api");
    try {
      const response = await fetch(`${API_URL}/perguntar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pergunta: pergunta }),
      });

      const data = await response.json();

      if (response.ok) {
        return data.resposta;
      } else {
        return "Erro reposta";
      }
    } catch (e) {
      return `Erro: ${e}`;
    }
  };

  const addNewMessage = async (userText, selectedFiles) => {
    const newUserMsg = { role: "user", text: userText };
    setChatHistory((prev) => [...prev, newUserMsg]);

    setIsLoading(true);

    if (selectedFiles.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("arquivos", selectedFiles[i]);
      }
      console.log("enviando arquivos");

      await treinarAPI(formData);
    }

    const reposta = await respostaAPI(userText);

    setIsLoading(false);

    const botReply = { role: "bot", text: `${reposta}` };
    setChatHistory((prev) => [...prev, botReply]);
  };

  return (
    <div className="flex flex-col h-screen w-full  bg-[#131314] font-sans">
      <div className="flex-1 overflow-y-auto p-4 w-full max-w-4xl mx-auto flex flex-col">
        {chatHistory.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}

        {isLoading && <TypingIndicator />}
      </div>

      <div className="w-full p-4 pb-8 bg-transparent shadow-lg shadow-olive-500">
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
