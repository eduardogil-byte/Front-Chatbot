import { useState } from "react";
import TypingIndicator from "./TypingIndicator";

function Sidebar({
  isOpen,
  onClose,
  arquivoTreinados,
  onTreinarNovos,
  onExcluirNoBanco,
  isLoading,
  API_URL,
}) {
  const [novosArquivos, setNovosArquivos] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [arquivoApagando, setArquivoApagando] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const removerArquivoNovo = (index) => {
    setNovosArquivos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === "application/pdf",
      );
      setNovosArquivos((prev) => [...prev, ...files]);
    }
  };

  const handleTreinarClick = async () => {
    await onTreinarNovos(novosArquivos);
    setNovosArquivos([]);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setNovosArquivos((prev) => [...prev, ...e.target.files]);
    }
  };

  const handleExcluirClick = async (nome) => {
    setArquivoApagando(nome);
    try {
      await onExcluirNoBanco(nome);
    } finally {
      setArquivoApagando(null);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        />
      )}

      <aside
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`fixed top-0 left-0 h-full w-80 bg-[#171717] border-r border-[#303030] z-50 transform transition-transform duration-[400ms] ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isDragging ? "border-blue-500 scale-[1.01] bg-[#1a231a]" : ""}`}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-semibold">Base de conhecimento</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Arquivo no Banco
            </div>
            {arquivoTreinados.map((nome, i) => {
              if (nome === "Todos") return null;

              if (arquivoApagando === nome) {
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center p-3 bg-red-900/10 rounded-xl border border-red-500/30"
                  >
                    <p className="text-red-500 text-xs font-bold uppercase mb-2">
                      Apagando arquivo...
                    </p>
                    <TypingIndicator />
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className="group flex items-center justify-between gap-1 p-2 rounded-lg bg-[#212121] hover:bg-[#2a2a2a] transition-colors"
                >
                  <a
                    href={`${API_URL}/arquivos/${encodeURIComponent(nome)}/ver`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 truncate pr-2 text-gray-300 text-sm hover:text-blue-400 cursor-pointer transition-colors flex-1"
                  >
                    <span className="text-blue-400">📄</span> {nome}
                  </a>
                  <button
                    onClick={() => handleExcluirClick(nome)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-sm text-white hover:bg-red-400 transition-all rounded-full"
                  >
                    ✕
                  </button>
                </div>
              );
            })}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-4 bg-green-900/10 rounded-xl border border-green-500/30">
                <p className="text-green-500 text-xs font-bold uppercase mb-2">
                  Treinando IA...
                </p>

                <TypingIndicator />
              </div>
            ) : (
              novosArquivos.length > 0 && (
                <div className="mt-6">
                  <div className="text-xs font-bold text-green-500 uppercase tracking-wider mb-2">
                    Novos para Treinar
                  </div>
                  <div className="space-y-2 border-2 border-green-500/50 border-dashed p-2 rounded-xl">
                    {novosArquivos.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-green-900/10 text-green-100 text-sm"
                      >
                        <span className="truncate pr-2">{file.name}</span>
                        <button
                          onClick={() => removerArquivoNovo(i)}
                          className="text-white hover:text-red-400"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleTreinarClick}
                      className="w-full bg-green-600/90 hover:bg-green-500/90 text-white py-2 rounded-lg text-sm font-bold transition-colors mt-2 cursor-pointer"
                    >
                      Treinar Agora
                    </button>
                  </div>
                </div>
              )
            )}
            {!isLoading &&
              arquivoTreinados.length <= 1 &&
              novosArquivos.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-10">
                  Arraste PDFs aqui para treinar a IA
                </div>
              )}
          </div>
          <div className="mt-4 pt-4 border-t border-[#303030]">
            <label
              htmlFor="file-upload-sidebar"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#2a2a2a] hover:bg-[#333333] border border-[#404040] hover:border-blue-500/50 text-gray-300 hover:text-white rounded-xl cursor-pointer transition-all duration-200 group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                ➕
              </span>
              <span className="text-sm font-medium">Adicione PDF</span>
            </label>
            <input
              type="file"
              id="file-upload-sidebar"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
export default Sidebar;
