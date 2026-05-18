export default function EditorContainer({ children }) {
  return (
    <div className="flex-1 bg-[#1e1e1e] overflow-hidden relative shadow-inner">
      {children}
    </div>
  );
}
