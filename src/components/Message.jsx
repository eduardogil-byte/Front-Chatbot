import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Message({ role, text }) {
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
      </div>
    </div>
  );
}
export default Message;
