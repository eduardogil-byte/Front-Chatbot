import { useEffect, useState } from "react";
import Input from "./components/Input";
import Message from "./components/Message";
import TypingIndicator from "./components/TypingIndicator";
import Sidebar from "./components/Sidebar";

function App() {
  const [chatHistory, setChatHistory] = useState([
    { role: "bot", text: "Olá como posso te ajudar hoje?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [arquivosDisponiveis, setArquivosDisponiveis] = useState(["Todos"]);

  const API_URL = "http://localhost:8000";

  const excluirArquivoNoBanco = async (nomeArquivo) => {
    if (
      !window.confirm(
        `Tem certeza que deseja excluir "${nomeArquivo}"? Isso removerá todo o treinamento deste arquivo.`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/arquivos/${encodeURIComponent(nomeArquivo)}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        await carregarArquivos();
      } else {
        alert("Erro ao excluir ");
      }
    } catch (e) {
      console.error("Erro ao excluir: ", e);
    }
  };

  const carregarArquivos = async () => {
    try {
      const response = await fetch(`${API_URL}/arquivos`);
      const data = await response.json();
      setArquivosDisponiveis(["Todos", ...data.arquivos]);
    } catch (e) {
      console.error("Erro ao buscar arquivos: ", e);
    }
  };

  useEffect(() => {
    carregarArquivos();
  }, []);

  const handleTreinarPelaSidebar = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("arquivos", file));

    setIsLoading(true);
    await treinarAPI(formData);
    await carregarArquivos();
    setIsLoading(false);
  };

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

  const respostaAPI = async (pergunta, arquivoSelecionado) => {
    console.log("dentro de resposta api");
    try {
      const response = await fetch(`${API_URL}/perguntar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pergunta: pergunta,
          arquivo_escolhido:
            arquivoSelecionado === "Todos" ? null : arquivoSelecionado,
        }),
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

  const addNewMessage = async (userText, selectedFiles, arquivoSelecionado) => {
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

    const reposta = await respostaAPI(userText, arquivoSelecionado);

    setIsLoading(false);

    const botReply = { role: "bot", text: `${reposta}` };
    setChatHistory((prev) => [...prev, botReply]);
  };

  return (
    <div className="flex flex-col h-screen w-full  bg-[#131314] font-sans">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-5 left-4 z-30 p-2 bg-[#212121] hover:bg-[#303030] roudned-lg text-white transition-colors"
      >
        ☰
      </button>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        arquivoTreinados={arquivosDisponiveis}
        onTreinarNovos={handleTreinarPelaSidebar}
        onExcluirNoBanco={excluirArquivoNoBanco}
        isLoading={isLoading}
      />

      <div className="flex-1 overflow-y-auto p-4 w-full max-w-4xl mx-auto flex flex-col">
        {chatHistory.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}

        {isLoading && <TypingIndicator />}
      </div>

      <div className="w-full p-4 pb-8 bg-transparent shadow-lg shadow-olive-500">
        <Input
          onSendMessage={addNewMessage}
          arquivosDisponiveis={arquivosDisponiveis}
          setArquivosDisponiveis={setArquivosDisponiveis}
        />
        <p className="text-center text-xs text-gray-500 mt-3">
          O Gemini pode apresentar informações imprecisas. Considere verificar
          as informações importantes. Não coloque nenhum dado sensível.
        </p>
      </div>
    </div>
  );
}

export default App;
