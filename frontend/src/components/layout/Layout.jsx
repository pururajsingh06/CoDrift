export default function Layout({ children }) {
  return (
    <div className="flex h-screen w-full bg-[#0d1117] text-gray-300 font-sans overflow-hidden">
      {children}
    </div>
  );
}
