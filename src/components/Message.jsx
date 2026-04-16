function Message({ role, text }) {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed break-words whitespace-pre-wrap
          ${
            isUser
              ? "bg-[#303030] text-white rounded-br-sm"
              : "bg-transparent text-gray-200"
          }`}
      >
        {text}
      </div>
    </div>
  );
}
export default Message;
