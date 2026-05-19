import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import CodeEditor from "../components/editor/CodeEditor";
import FileExplorer from "../components/files/FileExplorer";
import Layout from "../components/layout/Layout";
import TopBar from "../components/layout/TopBar";
import EditorContainer from "../components/editor/EditorContainer";
import OutputPanel from "../components/editor/OutputPanel";
import useAuthStore from "../store/useAuthStore";
import { API_URL, WS_URL } from "../services/api";
import axios from "axios";
 
const getLanguageFromFilename = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'py':
      return 'python';
    case 'cpp':
    case 'cc':
    case 'cxx':
    case 'h':
    case 'hpp':
      return 'cpp';
    case 'c':
      return 'c';
    case 'java':
      return 'java';
    case 'json':
      return 'json';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'md':
      return 'markdown';
    default:
      return 'plaintext';
  }
};

const getBoilerplateForFilename = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  const baseName = fileName.split('/').pop().split('.')[0];
  
  const javaClassName = baseName.replace(/[^a-zA-Z0-9]/g, "") || "Main";
  const formattedClassName = javaClassName.charAt(0).toUpperCase() + javaClassName.slice(1);

  switch (ext) {
    case 'js':
    case 'jsx':
      return `console.log("Hello, CoDrift JavaScript!");\n`;
    case 'ts':
    case 'tsx':
      return `console.log("Hello, CoDrift TypeScript!");\n`;
    case 'py':
      return `print("Hello, CoDrift Python!")\n`;
    case 'cpp':
    case 'cc':
    case 'cxx':
    case 'hpp':
      return `#include <iostream>\n\nint main() {\n    std::cout << "Hello, CoDrift C++!" << std::endl;\n    return 0;\n}\n`;
    case 'c':
    case 'h':
      return `#include <stdio.h>\n\nint main() {\n    printf("Hello, CoDrift C!\\n");\n    return 0;\n}\n`;
    case 'java':
      return `public class ${formattedClassName} {\n    public static void main(String[] args) {\n        System.out.println("Hello, CoDrift Java!");\n    }\n}\n`;
    case 'html':
      return `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>CoDrift Webpage</title>\n</head>\n<body>\n    <h1>Hello, CoDrift HTML!</h1>\n</body>\n</html>\n`;
    case 'css':
      return `body {\n    background-color: #0d1117;\n    color: #c9d1d9;\n    font-family: sans-serif;\n}\n`;
    case 'json':
      return `{\n  "name": "${baseName}",\n  "version": "1.0.0",\n  "description": "Collaborative project powered by CoDrift"\n}\n`;
    case 'md':
      return `# CoDrift Collaborative Document\n\nWelcome to your real-time collaborative markdown workspace!\n`;
    default:
      return "";
  }
};

import JSZip from "jszip";
import { saveAs } from "file-saver";

const EditorPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user: authUser, token } = useAuthStore();

  useEffect(() => {
    const joinRoomInDb = async () => {
      if (!roomId || !token) return;
      try {
        await axios.post(`${API_URL}/rooms/${roomId}/join`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to register room join in database:", err);
      }
    };
    joinRoomInDb();
  }, [roomId, token]);

  const [files, setFiles] = useState({});
  const [activeFile, setActiveFile] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (!activeFile && Object.keys(files).length > 0) {
      setActiveFile(Object.keys(files)[0]);
    }
  }, [files, activeFile]);

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isYjsReady, setIsYjsReady] = useState(false);

  const yjsRef = useRef(null);
  const yMapRef = useRef(null);

  useEffect(() => {
    const doc = new Y.Doc();
    const provider = new WebsocketProvider(WS_URL, roomId, doc);
    yjsRef.current = { doc, provider };
    
    
    const getSignatureColor = () => {
      const colors = [
        '#10b981', 
        '#3b82f6', 
        '#8b5cf6', 
        '#f43f5e', 
        '#f59e0b', 
        '#06b6d4', 
        '#14b8a6', 
        '#7c3aed', 
        '#ec4899', 
        '#d946ef', 
      ];
      const hashString = authUser?.email || authUser?.name || '';
      if (!hashString) {
        return colors[Math.floor(Math.random() * colors.length)];
      }
      let hash = 0;
      for (let i = 0; i < hashString.length; i++) {
        hash = hashString.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % colors.length;
      return colors[index];
    };

    
    const localUser = {
      id: authUser?.id || Math.random().toString(36).substring(2, 8),
      name: authUser?.name || `User-${Math.floor(Math.random() * 1000)}`,
      email: authUser?.email || null,
      avatar: authUser?.avatar || null,
      color: getSignatureColor(),
    };
    provider.awareness.setLocalStateField("user", localUser);

    const updateUsers = () => {
      const states = Array.from(provider.awareness.getStates().values());
      const users = states.map(state => state.user).filter(Boolean);
      const uniqueUsers = Array.from(new Map(users.map(u => [u.id, u])).values());
      setActiveUsers(uniqueUsers);
    };

    provider.awareness.on('change', updateUsers);
    updateUsers();

    const yFiles = doc.getMap("files");
    yMapRef.current = yFiles;

    const yMetadata = doc.getMap("metadata");

    const updateLocalFiles = () => {
      const currentFiles = yFiles.toJSON();
      if (Object.keys(currentFiles).length > 0 || yMetadata.get("initialized")) {
        setFiles(currentFiles);
      } else {
        yMetadata.set("initialized", true);
        setFiles({});
      }
    };

    yFiles.observe(updateLocalFiles);
    
    provider.on('synced', () => {
      updateLocalFiles();
      setIsYjsReady(true);
    });

    return () => {
      provider.destroy();
      doc.destroy();
    };
  }, [roomId]);

  useEffect(() => {
    const fileKeys = Object.keys(files);
    if (fileKeys.length > 0) {
      if (!files[activeFile]) {
        setActiveFile(fileKeys[0]);
      }
    } else {
      setActiveFile("");
    }
  }, [files, activeFile]);

  const handleDownloadFile = () => {
    if (!activeFile || !yjsRef.current) return;
    const content = yjsRef.current.doc.getText(activeFile).toString();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    
    const fileName = activeFile.split('/').pop();
    saveAs(blob, fileName);
  };

  const handleExportWorkspace = async () => {
    if (!yjsRef.current) return;
    const zip = new JSZip();
    
    Object.keys(files).forEach(filePath => {
      if (filePath.endsWith('.gitkeep')) return;
      const content = yjsRef.current.doc.getText(filePath).toString();
      zip.file(filePath, content);
    });
    
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `workspace-${roomId}.zip`);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleDownloadFile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, files]);

  const handleAddFile = (fileName, contentOrLanguage = "", optLanguage = null) => {
    if (yMapRef.current && !yMapRef.current.has(fileName)) {
      let content = "";
      let language = null;

      if (optLanguage !== null) {
        content = contentOrLanguage;
        language = optLanguage;
      } else {
        const isLangName = typeof contentOrLanguage === 'string' && 
                           contentOrLanguage.length < 20 && 
                           !contentOrLanguage.includes('\n') && 
                           !contentOrLanguage.includes(' ') &&
                           !contentOrLanguage.includes('{') &&
                           !contentOrLanguage.includes(';') &&
                           contentOrLanguage !== "";
                           
        if (isLangName) {
          language = contentOrLanguage;
          content = getBoilerplateForFilename(fileName);
        } else {
          content = contentOrLanguage || getBoilerplateForFilename(fileName);
          language = getLanguageFromFilename(fileName);
        }
      }

      yMapRef.current.set(fileName, {
        name: fileName,
        language: language || getLanguageFromFilename(fileName)
      });

      const yText = yjsRef.current.doc.getText(fileName);
      if (yText.length === 0 && content) {
        yText.insert(0, content);
      }
      
      setActiveFile(fileName);
    }
  };

  const handleUploadFiles = (uploadedFiles) => {
    if (!yMapRef.current || !yjsRef.current) return;
    
    
    const filesToProcess = uploadedFiles.slice(0, 50);
    
    filesToProcess.forEach(file => {
      
      if (file.size > 1024 * 1024) {
         console.warn(`File ${file.name} is too large (>1MB), skipping.`);
         return;
      }

      
      const fileName = file.webkitRelativePath || file.name;
      
      const language = getLanguageFromFilename(fileName);

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        
        if (!yMapRef.current.has(fileName)) {
          yMapRef.current.set(fileName, {
            name: fileName,
            language: language
          });
        }
        
        const yText = yjsRef.current.doc.getText(fileName);
        if (yText.length === 0) {
          yText.insert(0, content);
        }
        
        if (filesToProcess[0] === file) {
          setActiveFile(fileName);
        }
      };
      reader.readAsText(file);
    });
  };

  const handleDeleteFile = (fileName) => {
    if (yMapRef.current && yMapRef.current.has(fileName)) {
      yMapRef.current.delete(fileName);
    }
  };

  const handleRenameFile = (oldPath, newPath) => {
    if (!yMapRef.current || !yjsRef.current) return;
    if (oldPath === newPath) return;

    const renameOperations = [];
    Object.keys(files).forEach(filePath => {
      if (filePath === oldPath) {
        renameOperations.push({ old: filePath, new: newPath });
      } else if (filePath.startsWith(oldPath + '/')) {
        const newFilePath = newPath + filePath.substring(oldPath.length);
        renameOperations.push({ old: filePath, new: newFilePath });
      }
    });

    renameOperations.forEach(op => {
      const content = yjsRef.current.doc.getText(op.old).toString();
      const language = files[op.old]?.language || 'plaintext';

      yMapRef.current.set(op.new, {
        name: op.new,
        language: language
      });
      const newText = yjsRef.current.doc.getText(op.new);
      if (newText.length === 0 && content.length > 0) {
        newText.insert(0, content);
      }

      yMapRef.current.delete(op.old);
    });

    if (activeFile === oldPath || activeFile.startsWith(oldPath + '/')) {
      const newActive = activeFile.replace(oldPath, newPath);
      setActiveFile(newActive);
    }
  };

  const handleCopyFile = (sourcePath, destPath) => {
    if (!yMapRef.current || !yjsRef.current) return;
    if (sourcePath === destPath) return;

    const copyOperations = [];
    Object.keys(files).forEach(filePath => {
      if (filePath === sourcePath) {
        copyOperations.push({ old: filePath, new: destPath });
      } else if (filePath.startsWith(sourcePath + '/')) {
        const newFilePath = destPath + filePath.substring(sourcePath.length);
        copyOperations.push({ old: filePath, new: newFilePath });
      }
    });

    copyOperations.forEach(op => {
      const content = yjsRef.current.doc.getText(op.old).toString();
      const language = files[op.old]?.language || 'plaintext';

      yMapRef.current.set(op.new, {
        name: op.new,
        language: language
      });
      const newText = yjsRef.current.doc.getText(op.new);
      if (newText.length === 0 && content.length > 0) {
        newText.insert(0, content);
      }
    });
  };

  const currentFile = files[activeFile];

  const handleRunCode = async () => {
    if (!currentFile || !yjsRef.current) return;
    
    
    const workspaceFiles = {};
    Object.keys(files).forEach((fileName) => {
      workspaceFiles[fileName] = yjsRef.current.doc.getText(fileName).toString();
    });

    setIsRunning(true);
    setOutput("Running workspace...");

    try {
      const response = await fetch(`${API_URL}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          files: workspaceFiles,
          mainFile: activeFile
        }),
      });

      const data = await response.json();

      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput(data.output);
      }
    } catch (err) {
      setOutput(`Execution failed: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  if (!isYjsReady) {
    return (
      <Layout>
        <div className="flex items-center justify-center w-full h-full text-gray-500">
          Loading workspace...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <FileExplorer
        files={files}
        activeFile={activeFile}
        setActiveFile={setActiveFile}
        onAddFile={handleAddFile}
        onDeleteFile={handleDeleteFile}
        onUploadFiles={handleUploadFiles}
        onRenameFile={handleRenameFile}
        onCopyFile={handleCopyFile}
        activeUsers={activeUsers}
        provider={yjsRef.current.provider}
        doc={yjsRef.current.doc}
      />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <TopBar 
          roomId={roomId} 
          activeFile={activeFile} 
          isRunning={isRunning} 
          onRun={handleRunCode} 
          onExportWorkspace={handleExportWorkspace}
          onDownloadFile={handleDownloadFile}
          onExit={() => navigate('/dashboard')}
        />
        <EditorContainer>
          {currentFile ? (
            <CodeEditor
              key={activeFile}
              activeFile={activeFile}
              doc={yjsRef.current.doc}
              provider={yjsRef.current.provider}
              language={currentFile.language}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 space-y-4 bg-[#1e1e1e]">
              <div className="p-4 rounded-full bg-gray-800/50 border border-gray-700/60 shadow-lg text-blue-400 animate-pulse">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold tracking-wide text-gray-200">Your Workspace is Empty</h3>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                Create a new file in the File Explorer sidebar or import a project from GitHub to collaborate!
              </p>
            </div>
          )}
        </EditorContainer>
        <OutputPanel output={output} files={files} doc={yjsRef.current.doc} />
      </div>
    </Layout>
  );
};

export default EditorPage;