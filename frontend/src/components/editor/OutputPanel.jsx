import { useState, useRef, useEffect } from 'react';
import { Terminal, Play } from 'lucide-react';
import { API_URL } from '../../services/api';

export default function OutputPanel({ output, files, doc }) {
  const [activeTab, setActiveTab] = useState('output'); 
  
  
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState([
    "CoDrift Interactive Git Terminal v1.0.0",
    "Type 'help' to see list of available commands.",
    ""
  ]);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const [staged, setStaged] = useState([]);
  const [commitMsg, setCommitMsg] = useState("");
  const [remote, setRemote] = useState("");
  
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  
  const [psInputVal, setPsInputVal] = useState("");
  const [psHistory, setPsHistory] = useState([
    "Windows PowerShell",
    "Copyright (C) Microsoft Corporation. All rights reserved.",
    "",
    "Try the new cross-platform PowerShell https://aka.ms/pscore6",
    ""
  ]);
  const [psCmdHistory, setPsCmdHistory] = useState([]);
  const [psHistoryIndex, setPsHistoryIndex] = useState(-1);
  const [psCwd, setPsCwd] = useState(""); 
  
  const psTerminalEndRef = useRef(null);
  const psInputRef = useRef(null);

  
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  
  useEffect(() => {
    if (psTerminalEndRef.current) {
      psTerminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [psHistory]);

  
  useEffect(() => {
    const initPs = async () => {
      try {
        const res = await fetch(`${API_URL}/execute/powershell`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command: "", cwd: "" })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.cwd) {
            setPsCwd(data.cwd);
          }
        }
      } catch (e) {
        console.warn("Failed to initialize PowerShell CWD:", e);
      }
    };
    initPs();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = inputVal;
      setInputVal("");
      if (cmd.trim()) {
        setCmdHistory(prev => [...prev, cmd]);
      }
      setHistoryIndex(-1);
      executeGitCommand(cmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      
      const newIdx = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIdx);
      setInputVal(cmdHistory[newIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      
      const newIdx = historyIndex + 1;
      if (newIdx >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(newIdx);
        setInputVal(cmdHistory[newIdx]);
      }
    }
  };

  const handlePsKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = psInputVal;
      setPsInputVal("");
      if (cmd.trim()) {
        setPsCmdHistory(prev => [...prev, cmd]);
      }
      setPsHistoryIndex(-1);
      executePowerShellCommand(cmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (psCmdHistory.length === 0) return;
      
      const newIdx = psHistoryIndex === -1 ? psCmdHistory.length - 1 : Math.max(0, psHistoryIndex - 1);
      setPsHistoryIndex(newIdx);
      setPsInputVal(psCmdHistory[newIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (psHistoryIndex === -1) return;
      
      const newIdx = psHistoryIndex + 1;
      if (newIdx >= psCmdHistory.length) {
        setPsHistoryIndex(-1);
        setPsInputVal("");
      } else {
        setPsHistoryIndex(newIdx);
        setPsInputVal(psCmdHistory[newIdx]);
      }
    }
  };

  const parseGithubUrl = (url) => {
    let cleanUrl = url.trim().replace(/\.git$/, "").replace(/\/$/, "");
    try {
      const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        return { owner: match[1], repo: match[2] };
      }
    } catch (e) {}
    return null;
  };

  const triggerGitPush = async () => {
    const parsed = parseGithubUrl(remote);
    if (!parsed) {
      setHistory(prev => [...prev, `fatal: Could not parse remote GitHub URL: ${remote}`, ""]);
      return;
    }
    
    const token = localStorage.getItem("github_pat") || prompt("Please enter your GitHub Personal Access Token (PAT) with repository write permissions:");
    if (!token) {
      setHistory(prev => [...prev, "fatal: GitHub Personal Access Token is required to push changes.", ""]);
      return;
    }
    
    localStorage.setItem("github_pat", token);
    
    setHistory(prev => [
      ...prev,
      "Pushing to GitHub remote...",
      `Compressing and uploading ${staged.length} files...`
    ]);
    
    try {
      const { owner, repo } = parsed;
      const branch = "main";
      
      let shas = {};
      try {
        const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (treeRes.ok) {
          const treeData = await treeRes.json();
          treeData.tree.forEach(item => {
            if (item.type === 'blob') {
              shas[item.path] = item.sha;
            }
          });
        }
      } catch (e) {
        console.warn("Failed to pre-fetch existing SHAs, proceeding...", e);
      }
      
      let pushSuccessCount = 0;
      for (const filePath of staged) {
        if (!doc) continue;
        const content = doc.getText(filePath).toString();
        const base64Content = btoa(unescape(encodeURIComponent(content)));
        
        const payload = {
          message: commitMsg,
          content: base64Content,
          branch: branch
        };
        
        if (shas[filePath]) {
          payload.sha = shas[filePath];
        }
        
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (res.ok) {
          pushSuccessCount++;
          setHistory(prev => [...prev, ` -> Uploaded: ${filePath}`]);
        } else {
          const errData = await res.json();
          setHistory(prev => [...prev, ` -> Failed: ${filePath} (${errData.message})`]);
        }
      }
      
      if (pushSuccessCount > 0) {
        setHistory(prev => [
          ...prev,
          "Connection to github.com closed.",
          `Successfully pushed ${pushSuccessCount} files to ${owner}/${repo} [${branch}]!`,
          "Everything up-to-date.",
          ""
        ]);
        setStaged([]);
        setCommitMsg("");
      } else {
        setHistory(prev => [...prev, "fatal: Failed to push any files. Please verify repository permissions.", ""]);
      }
    } catch (err) {
      setHistory(prev => [...prev, `fatal: Network error during push: ${err.message}`, ""]);
    }
  };

  const executeGitCommand = async (commandLine) => {
    const trimmed = commandLine.trim();
    if (!trimmed) return;
    
    setHistory(prev => [...prev, `codrift@workspace:~$ ${commandLine}`]);
    
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    
    if (cmd === 'clear') {
      setHistory([]);
      return;
    }
    
    if (cmd === 'help') {
      setHistory(prev => [
        ...prev,
        "Available commands:",
        "  git status                    Show modified and staged files",
        "  git add .                     Stage all workspace files",
        "  git add <file>                Stage specific file",
        "  git commit -m \"message\"       Commit staged changes locally",
        "  git remote add origin <url>   Configure remote GitHub URL",
        "  git remote -v                 View remote URL",
        "  git push                      Push committed changes directly to GitHub",
        "  clear                         Clear terminal history",
        ""
      ]);
      return;
    }
    
    if (cmd !== 'git') {
      setHistory(prev => [...prev, `bash: ${cmd}: command not found. Type 'help' for options.`, ""]);
      return;
    }
    
    const sub = parts[1];
    if (!sub) {
      setHistory(prev => [...prev, "Usage: git <command> (try 'help' for available commands)", ""]);
      return;
    }
    
    if (sub === 'status') {
      const fileList = Object.keys(files || {}).filter(f => !f.endsWith('.gitkeep'));
      if (fileList.length === 0) {
        setHistory(prev => [...prev, "nothing to commit, working tree clean", ""]);
        return;
      }
      
      const stagedList = fileList.filter(f => staged.includes(f));
      const unstagedList = fileList.filter(f => !staged.includes(f));
      
      let outputLines = [];
      if (stagedList.length > 0) {
        outputLines.push("Changes to be committed:");
        outputLines.push("  (use \"git restore --staged <file>...\" to unstage)");
        stagedList.forEach(f => {
          outputLines.push(`  staged:   ${f}`);
        });
        outputLines.push("");
      }
      
      if (unstagedList.length > 0) {
        outputLines.push("Changes not staged for commit:");
        outputLines.push("  (use \"git add <file>...\" to update what will be committed)");
        unstagedList.forEach(f => {
          outputLines.push(`  modified: ${f}`);
        });
        outputLines.push("");
      }
      
      if (stagedList.length === 0 && unstagedList.length === 0) {
        outputLines.push("nothing to commit, working tree clean");
      }
      
      setHistory(prev => [...prev, ...outputLines, ""]);
      return;
    }
    
    if (sub === 'add') {
      const target = parts.slice(2).join(' ');
      if (!target) {
        setHistory(prev => [...prev, "Nothing specified, nothing added. Did you mean 'git add .'?"]);
        return;
      }
      
      if (target === '.') {
        const fileList = Object.keys(files || {}).filter(f => !f.endsWith('.gitkeep'));
        setStaged(fileList);
        setHistory(prev => [...prev, `Staged ${fileList.length} files.`, ""]);
      } else {
        if (files && files[target]) {
          setStaged(prev => Array.from(new Set([...prev, target])));
          setHistory(prev => [...prev, `Staged '${target}'.`, ""]);
        } else {
          setHistory(prev => [...prev, `fatal: pathspec '${target}' did not match any files`, ""]);
        }
      }
      return;
    }
    
    if (sub === 'commit') {
      const mIdx = parts.indexOf('-m');
      if (mIdx === -1 || !parts[mIdx + 1]) {
        setHistory(prev => [...prev, "error: switch 'm' requires a value", "usage: git commit -m <message>", ""]);
        return;
      }
      
      const fullCmd = parts.slice(mIdx + 1).join(' ');
      const match = fullCmd.match(/["'](.*?)["']/);
      const msg = match ? match[1] : parts[mIdx + 1];
      
      if (staged.length === 0) {
        setHistory(prev => [...prev, "nothing to commit, working tree clean", ""]);
        return;
      }
      
      setCommitMsg(msg);
      setHistory(prev => [
        ...prev,
        `[main (root-commit)] ${msg}`,
        ` ${staged.length} files staged for push.`,
        ""
      ]);
      return;
    }
    
    if (sub === 'remote') {
      const action = parts[2];
      if (action === 'add') {
        const name = parts[3];
        const url = parts[4];
        if (name === 'origin' && url) {
          setRemote(url);
          setHistory(prev => [...prev, `Added remote ${name} at ${url}`, ""]);
        } else {
          setHistory(prev => [...prev, "Usage: git remote add origin <url>", ""]);
        }
      } else if (action === 'remove') {
        setRemote("");
        setHistory(prev => [...prev, "Removed remote origin.", ""]);
      } else if (action === '-v' || !action) {
        if (remote) {
          setHistory(prev => [
            ...prev,
            `origin\t${remote} (fetch)`,
            `origin\t${remote} (push)`,
            ""
          ]);
        } else {
          setHistory(prev => [...prev, "No remotes configured.", ""]);
        }
      }
      return;
    }
    
    if (sub === 'push') {
      if (!remote) {
        setHistory(prev => [
          ...prev,
          "fatal: No configured push destination.",
          "Please configure using: git remote add origin <url>",
          ""
        ]);
        return;
      }
      
      if (!commitMsg || staged.length === 0) {
        setHistory(prev => [...prev, "Everything up-to-date (nothing to push)", ""]);
        return;
      }
      
      triggerGitPush();
      return;
    }
    
    setHistory(prev => [...prev, `git: '${sub}' is not a git command. See 'help'.`, ""]);
  };

  const executePowerShellCommand = async (commandLine) => {
    const trimmed = commandLine.trim();
    const promptString = `PS ${psCwd || "C:"}> ${commandLine}`;
    
    setPsHistory(prev => [...prev, promptString]);
    
    if (!trimmed) return;
    
    if (trimmed === 'clear' || trimmed === 'cls') {
      setPsHistory([]);
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/execute/powershell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: trimmed, cwd: psCwd })
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.output) {
          setPsHistory(prev => [...prev, data.output, ""]);
        }
        if (data.cwd) {
          setPsCwd(data.cwd);
        }
      } else {
        setPsHistory(prev => [...prev, `Error: Failed to reach PowerShell backend api (${res.statusText})`, ""]);
      }
    } catch (err) {
      setPsHistory(prev => [...prev, `Error: Connection to PowerShell server failed: ${err.message}`, ""]);
    }
  };

  return (
    <div className="h-64 bg-[#0d1117] border-t border-gray-800 flex flex-col flex-shrink-0 relative group">
      {}
      <div className="px-5 bg-[#161b22] flex items-center justify-between border-b border-gray-800/80">
        <div className="flex space-x-6 h-10 items-center">
          <button 
            onClick={() => setActiveTab('output')}
            className={`text-xs font-bold uppercase tracking-widest flex items-center space-x-2 h-full border-b-2 px-1 transition-all cursor-pointer ${
              activeTab === 'output' 
                ? "text-blue-400 border-blue-500" 
                : "text-gray-500 border-transparent hover:text-gray-300"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Console Output</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('git')}
            className={`text-xs font-bold uppercase tracking-widest flex items-center space-x-2 h-full border-b-2 px-1 transition-all cursor-pointer ${
              activeTab === 'git' 
                ? "text-blue-400 border-blue-500" 
                : "text-gray-500 border-transparent hover:text-gray-300"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Git Console</span>
          </button>

          <button 
            onClick={() => setActiveTab('powershell')}
            className={`text-xs font-bold uppercase tracking-widest flex items-center space-x-2 h-full border-b-2 px-1 transition-all cursor-pointer ${
              activeTab === 'powershell' 
                ? "text-blue-400 border-blue-500" 
                : "text-gray-500 border-transparent hover:text-gray-300"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-blue-500" />
            <span>PowerShell</span>
          </button>
        </div>
      </div>
      
      {}
      <div className="flex-1 overflow-auto font-mono text-[13px] leading-relaxed bg-[#0d1117] shadow-inner p-5">
        {activeTab === 'output' && (
          <pre className="whitespace-pre-wrap break-words text-green-400">{output || "Waiting for execution..."}</pre>
        )}

        {activeTab === 'git' && (
          <div 
            className="h-full flex flex-col text-gray-300 cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex-1 overflow-y-auto space-y-1 mb-2 scrollbar-thin">
              {history.map((line, idx) => {
                let colorClass = "text-gray-300";
                if (line.startsWith("codrift@workspace")) {
                  colorClass = "text-blue-400 font-bold";
                } else if (line.includes("staged:")) {
                  colorClass = "text-green-400";
                } else if (line.includes("modified:")) {
                  colorClass = "text-red-400";
                } else if (line.includes("Successfully pushed") || line.includes("Uploaded:")) {
                  colorClass = "text-emerald-400 font-medium";
                } else if (line.startsWith("fatal:") || line.startsWith("error:")) {
                  colorClass = "text-red-500 font-bold";
                }
                
                return (
                  <div key={idx} className={`${colorClass} whitespace-pre-wrap break-all`}>
                    {line}
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0 pt-2 border-t border-gray-800">
              <span className="text-blue-400 font-bold flex-shrink-0">codrift@workspace:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-white font-mono text-[13px] p-0"
                placeholder="git commit -m 'initial commit'..."
                autoFocus={activeTab === 'git'}
              />
            </div>
          </div>
        )}

        {activeTab === 'powershell' && (
          <div 
            className="h-full flex flex-col text-[#cccccc] cursor-text"
            onClick={() => psInputRef.current?.focus()}
          >
            <div className="flex-1 overflow-y-auto space-y-1 mb-2 scrollbar-thin">
              {psHistory.map((line, idx) => {
                let colorClass = "text-[#cccccc]";
                if (line.startsWith("PS ")) {
                  colorClass = "text-sky-400 font-bold";
                } else if (line.includes("Error:") || line.includes("failed:")) {
                  colorClass = "text-red-400 font-medium";
                }
                
                return (
                  <div key={idx} className={`${colorClass} whitespace-pre-wrap break-all`}>
                    {line}
                  </div>
                );
              })}
              <div ref={psTerminalEndRef} />
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0 pt-2 border-t border-gray-800">
              <span className="text-sky-400 font-bold flex-shrink-0">PS {psCwd || "C:"}&gt;</span>
              <input
                ref={psInputRef}
                type="text"
                value={psInputVal}
                onChange={(e) => setPsInputVal(e.target.value)}
                onKeyDown={handlePsKeyDown}
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-white font-mono text-[13px] p-0"
                placeholder="dir, npm install, cd api..."
                autoFocus={activeTab === 'powershell'}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
