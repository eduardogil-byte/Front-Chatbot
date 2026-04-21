import { useRef, useState } from "react";

function Input({
  onSendMessage,
  arquivosDisponiveis,
  arquivoSelecionado,
  setArquivoSelecionado,
}) {
  const [input, setInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const textareaRef = useRef(null);
  const API_URL = "https://api-chatbot-oebg.onrender.com";

  const processFiles = (filesList) => {
    const filesArray = Array.from(filesList);
    setSelectedFiles((prev) => [...prev, ...filesArray]);
  };

  const handleSend = () => {
    if (input.trim()) {
      console.log(selectedFiles.length);
      onSendMessage(input, selectedFiles);

      setInput("");
      setSelectedFiles([]);

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleChange = (e) => {
    setInput(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col w-full max-w-3xl mx-auto rounded-4xl pb-5 shadow-lg transition-all duration-200 border-2
        ${
          isDragging
            ? "bg-[#2a2a2a] border-blue-500 scale-[1.02]"
            : "bg-[#1e1e1e] border-transparent"
        }
        
        `}
    >
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 py-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-[#303030] px-3 py-1.5 rounded-xl border border-[#404040]"
            >
              <span className="text-red-400 text-sm">📄</span>

              <span
                className="text-gray-200 text-sm truncate max-w-[150px]"
                title={file.name}
              >
                {file.name}
              </span>

              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-white ml-1 text-lg leading-none mb-0.5"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 px-3 py-2">
        <textarea
          ref={textareaRef}
          value={input}
          placeholder="Pergunte algo..."
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          className="w-full bg-transparent text-gray-200 outline-none placeholder-gray-400 p-2 resize-none max-h-[200px] overflow-y-auto"
        />
      </div>

      <div className="flex items-center justify-between px-3 mt-1">
        <div className="flex items-center gap-4">
          <div>
            <label
              htmlFor="file-upload"
              className="text-xs text-gray-400 hover:text-gray-200 cursor-pointer flex items-center transition-colors px-1"
            >
              📎 Adicionar arquivo
            </label>
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex items-center gap-2 border-l border-[#404040] pl-4">
            <label className="text-xs text-gray-400">Consultar em:</label>
            <select
              value={arquivoSelecionado}
              onChange={(e) => setArquivoSelecionado(e.target.value)}
              className="bg-[#303030] text-gray-200 text-xs px-2 py-1.5 rounded-lg border border-[#404040] outline-none hover:border-gray-400 focus:border-blue-500 cursor-pointer transition-colors max-w-[150px] truncate"
            >
              {arquivosDisponiveis.map((nome, index) => (
                <option key={index} value={nome}>
                  {nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSend}
          className="bg-[#303030] hover:bg-[#404040] text-gray-200 px-4 py-2 rounded-full transition-colors text-sm font-medium"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
export default Input;
