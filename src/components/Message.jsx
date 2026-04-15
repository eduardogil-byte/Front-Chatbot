function Message({ role, text }) {
  return (
    <div>
      <div className={`${role}`}>
        <div>{text}</div>
      </div>
    </div>
  );
}
export default Message;
