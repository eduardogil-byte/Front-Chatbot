import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Message({ role, text, fontes = [], API_URL }) {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] px-4 py-3 rounded-2xl text-base leading-relaxed break-words
          ${
            isUser
              ? "bg-[#303030] text-white rounded-br-sm"
              : "bg-transparent text-gray-200"
          }`}
      >
        <div
          className="prose prose-invert max-w-none
            prose-p:my-3
            prose-ul:my-2
            prose-ol:my-1
            prose-li:my-0
            prose-headings:my-2
            prose-strong:text-white
            prose-p:first:mt-0
            prose-p:last:mb-0
        "
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>

        {!isUser && fontes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#303030] flex flex-wrap gap-2">
            {fontes.map((fonte, index) => (
              <a
                key={index}
                href={`${API_URL}${fonte.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-[#242424] hover:bg-[#333333] text-blue-300 border border-[#404040] px-3 py-1.5 rounded-full transition-colors"
              >
                📄 {fonte.arquivo} — pág. {fonte.pagina}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default Message;
