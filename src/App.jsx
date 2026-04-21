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
  const [arquivoSelecionado, setArquivoSelecionado] = useState(() => {
    return localStorage.getItem("ultimoPdfConsultado") || "Todos";
  });

  const API_URL = "https://api-chatbot-oebg.onrender.com";

  useEffect(() => {
    localStorage.setItem("ultimoPdfConsultado", arquivoSelecionado);
  }, [arquivoSelecionado]);

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

  useEffect(() => {
    if (!arquivosDisponiveis.includes(arquivoSelecionado)) {
      setArquivoSelecionado("Todos");
    }
  }, [arquivosDisponiveis, arquivoSelecionado]);

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

  const addNewMessage = async (userText, selectedFiles) => {
    const newUserMsg = { role: "user", text: userText };
    setChatHistory((prev) => [...prev, newUserMsg]);

    setIsLoading(true);

    let arquivoAlvoPergunta = arquivoSelecionado;

    if (selectedFiles.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("arquivos", selectedFiles[i]);
      }
      console.log("enviando arquivos");

      await treinarAPI(formData);
      await carregarArquivos();

      arquivoAlvoPergunta = selectedFiles[0].name;
      setArquivoSelecionado(arquivoAlvoPergunta);
    }

    const reposta = await respostaAPI(userText, arquivoAlvoPergunta);

    setIsLoading(false);

    const botReply = { role: "bot", text: `${reposta}` };
    setChatHistory((prev) => [...prev, botReply]);
  };

  return (
    <div className="flex flex-col h-screen w-full  bg-[#131314] font-sans">
      <header className="flex items-center gap-2.5 px-4 py-3 bg-[#131314] border-b border-[#303030] w-full z-10 shrink-0">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-sm bg-[#212121] hover:bg-[#303030] roudned-lg text-white transition-colors"
          title="Mostrar todos os arquivos"
        >
          ☰ Arquivos
        </button>
        <h1 className="text-white">Consultando em {arquivoSelecionado}</h1>
      </header>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        arquivoTreinados={arquivosDisponiveis}
        onTreinarNovos={handleTreinarPelaSidebar}
        onExcluirNoBanco={excluirArquivoNoBanco}
        isLoading={isLoading}
        API_URL={API_URL}
      />

      <div className="flex-1 overflow-y-auto p-4 w-full max-w-4xl mx-auto flex flex-col">
        {chatHistory.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}

        {isLoading && <TypingIndicator />}
      </div>

      <div className="w-full p-4 pb-7 bg-transparent shadow-lg shadow-olive-500">
        <Input
          onSendMessage={addNewMessage}
          arquivosDisponiveis={arquivosDisponiveis}
          arquivoSelecionado={arquivoSelecionado}
          setArquivoSelecionado={setArquivoSelecionado}
        />
        <p className="text-center text-xs text-gray-400 mt-3">
          O Gemini pode apresentar informações imprecisas. Considere verificar
          as informações importantes. Não coloque nenhum dado sensível.
        </p>
      </div>
    </div>
  );
}

export default App;
