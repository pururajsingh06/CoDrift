export default function TopBar({ roomId, activeFile, isRunning, onRun, onExportWorkspace, onDownloadFile, onExit }) {
  const hasActiveFile = !!activeFile;

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-[#161b22] border-b border-gray-800 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="font-semibold text-gray-400 flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <span>Room: <span className="text-gray-200">{roomId}</span></span>
        </div>
        <span className="text-gray-600">|</span>
        
        {hasActiveFile ? (
          <div className="flex items-center space-x-2 bg-[#21262d] px-3 py-1.5 rounded-md">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span className="text-gray-300 text-sm font-medium">{activeFile}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-[#21262d]/40 px-3 py-1.5 rounded-md">
            <span className="text-gray-500 text-sm italic font-medium">No active file</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={onDownloadFile}
          disabled={!hasActiveFile}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            hasActiveFile
              ? "bg-gray-800 hover:bg-gray-700 text-gray-300 cursor-pointer"
              : "bg-gray-800/40 text-gray-600 cursor-not-allowed"
          }`}
          title={hasActiveFile ? "Download Active File (Ctrl+S)" : "No file active"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span>Save File</span>
        </button>
        
        <button
          onClick={onExportWorkspace}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md text-sm font-medium transition-colors cursor-pointer"
          title="Export Workspace as ZIP"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
          <span>Export</span>
        </button>
        
        <button
          onClick={onExit}
          className="flex items-center space-x-2 px-4 py-2 bg-red-900/40 hover:bg-red-800/60 text-red-300 rounded-md text-sm font-medium transition-colors cursor-pointer"
          title="Exit Room"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span>Exit</span>
        </button>
        
        <button
          onClick={onRun}
          disabled={isRunning || !hasActiveFile}
          className={`flex items-center space-x-2 px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
            isRunning || !hasActiveFile
              ? "bg-green-600/30 text-white/40 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500 text-white cursor-pointer active:scale-95 shadow-md shadow-green-900/20 hover:shadow-green-900/40"
          }`}
        >
          {isRunning ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Running...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
              <span>Run Code</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
