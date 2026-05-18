import { useRef, useState, useMemo, useEffect } from 'react';
import ActionModal from '../ui/ActionModal';
import Avatar from '../ui/Avatar';
import { Mic, MicOff, PhoneCall, PhoneOff, Users, Volume2, ChevronDown, ChevronRight } from 'lucide-react';

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

const FileIcon = ({ fileName }) => {
  const ext = fileName.split('.').pop().toLowerCase();
  
  switch (ext) {
    case 'js':
    case 'jsx':
      return (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#F7DF1E"/>
          <text x="12" y="17" fill="#000000" fontSize="12" fontWeight="900" fontFamily="system-ui" textAnchor="middle">JS</text>
        </svg>
      );
    case 'ts':
    case 'tsx':
      return (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#3178C6"/>
          <text x="12" y="17" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="system-ui" textAnchor="middle">TS</text>
        </svg>
      );
    case 'py':
      return (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.8 1.9C9.7 1.9 8.1 3.4 8.1 5.5v2.7h4V9H6.6C4.5 9 3 10.5 3 12.6v4c0 2.1 1.5 3.6 3.6 3.6h2.7v-3.7c0-2 1.6-3.7 3.6-3.7h5.1c2 0 3.6-1.7 3.6-3.7V5.5c0-2.1-1.6-3.6-3.6-3.6h-6.2z" fill="#3776AB"/>
          <path d="M12.2 22.1c2.1 0 3.7-1.5 3.7-3.6v-2.7h-4v-.8h5.5c2.1 0 3.6-1.5 3.6-3.6v-4c0-2.1-1.5-3.6-3.6-3.6h-2.7v3.7c0 2-1.6 3.7-3.6 3.7H8.5c-2 0-3.6 1.7-3.6 3.7v3.8c0 2.1 1.6 3.6 3.6 3.6h6.2z" fill="#FFE873"/>
          <circle cx="9.8" cy="4.8" r="0.6" fill="#fff"/>
          <circle cx="14.2" cy="19.2" r="0.6" fill="#000"/>
        </svg>
      );
    case 'cpp':
    case 'cc':
    case 'cxx':
    case 'hpp':
      return (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#00599C"/>
          <text x="12" y="16" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="system-ui" textAnchor="middle">C++</text>
        </svg>
      );
    case 'c':
    case 'h':
      return (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#659AD2"/>
          <text x="12" y="17" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="system-ui" textAnchor="middle">C</text>
        </svg>
      );
    case 'java':
      return (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#EA2D2E"/>
          <path d="M6 9h10v5c0 2-1.8 3.5-4 3.5h-2c-2.2 0-4-1.5-4-3.5V9zm10 2h1c.5 0 1 .4 1 1s-.5 1-1 1h-1v-2z" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M8.5 4.5v2.5M11 3.5v3.5M13.5 4.5v2.5" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      );
    case 'json':
      return (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#2E3440"/>
          <text x="12" y="16.5" fill="#88C0D0" fontSize="13" fontWeight="900" fontFamily="monospace" textAnchor="middle">{"{}"}</text>
        </svg>
      );
    case 'html':
      return (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#E34F26"/>
          <text x="12" y="16" fill="#FFFFFF" fontSize="9" fontWeight="900" fontFamily="system-ui" textAnchor="middle">HTML</text>
        </svg>
      );
    case 'css':
      return (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#1572B6"/>
          <text x="12" y="16" fill="#FFFFFF" fontSize="9" fontWeight="900" fontFamily="system-ui" textAnchor="middle">CSS</text>
        </svg>
      );
    case 'md':
      return (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#0083FF"/>
          <text x="12" y="17" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">M↓</text>
        </svg>
      );
    default:
      return (
        <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
      );
  }
};

export default function FileExplorer({ 
  files, 
  activeFile, 
  setActiveFile, 
  onAddFile, 
  onDeleteFile, 
  onUploadFiles, 
  onRenameFile, 
  onCopyFile, 
  activeUsers = [],
  provider,
  doc
}) {
  const [joinedVoice, setJoinedVoice] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [remoteTracks, setRemoteTracks] = useState({}); 
  const [showActiveUsers, setShowActiveUsers] = useState(true);

  
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [githubBranch, setGithubBranch] = useState("");
  const [importingGithub, setImportingGithub] = useState(false);
  const [importProgress, setImportProgress] = useState("");

  const parseGithubUrl = (url) => {
    let cleanUrl = url.trim().replace(/\/$/, "");
    if (!cleanUrl.includes("github.com") && cleanUrl.split("/").length === 2) {
      const [owner, repo] = cleanUrl.split("/");
      return { owner, repo };
    }
    try {
      const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        return { owner: match[1], repo: match[2] };
      }
    } catch (e) {}
    return null;
  };

  const handleGithubImport = async (e) => {
    e.preventDefault();
    const parsed = parseGithubUrl(githubUrl);
    if (!parsed) {
      alert("Invalid GitHub URL or Repository format. Please use 'owner/repo' or 'https://github.com/owner/repo'.");
      return;
    }

    setImportingGithub(true);
    setImportProgress("Fetching repository details...");

    try {
      const { owner, repo } = parsed;
      let branch = githubBranch.trim();
      if (!branch) {
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (!repoRes.ok) {
          throw new Error("Repository not found or is private.");
        }
        const repoData = await repoRes.json();
        branch = repoData.default_branch;
      }

      setImportProgress(`Fetching file tree for branch '${branch}'...`);

      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
      if (!treeRes.ok) {
        throw new Error("Failed to fetch repository tree.");
      }
      const treeData = await treeRes.json();

      if (!treeData.tree || treeData.tree.length === 0) {
        throw new Error("Repository is empty.");
      }

      const filesToImport = treeData.tree.filter(item => 
        item.type === 'blob' && 
        !item.path.startsWith('.') && 
        !item.path.includes('/.') &&
        !item.path.includes('node_modules/') &&
        !item.path.includes('dist/') &&
        !item.path.includes('build/') &&
        !item.path.includes('package-lock.json') &&
        !item.path.includes('yarn.lock')
      );

      if (filesToImport.length === 0) {
        throw new Error("No importable files found in this repository.");
      }

      setImportProgress(`Importing ${filesToImport.length} files...`);

      let importedCount = 0;
      for (const file of filesToImport) {
        try {
          setImportProgress(`Importing (${importedCount + 1}/${filesToImport.length}): ${file.path}`);
          const rawRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`);
          if (!rawRes.ok) continue;
          const content = await rawRes.text();
          onAddFile(file.path, content);
          importedCount++;
        } catch (err) {
          console.warn(`Failed to import file: ${file.path}`, err);
        }
      }

      alert(`Successfully imported ${importedCount} files from ${owner}/${repo}!`);
      setShowGithubModal(false);
      setGithubUrl("");
      setGithubBranch("");
    } catch (err) {
      console.error(err);
      alert(`Import failed: ${err.message}`);
    } finally {
      setImportingGithub(false);
      setImportProgress("");
    }
  };

  const localStream = useRef(null);
  const peerConnections = useRef({}); 
  const localAudioContext = useRef(null);
  const localAnalyser = useRef(null);
  const localSpeakingInterval = useRef(null);

  
  const localUser = useMemo(() => {
    return provider?.awareness?.getLocalState()?.user;
  }, [provider, activeUsers]);

  
  const voiceUsers = useMemo(() => {
    return activeUsers.filter(u => u.inVoiceChannel);
  }, [activeUsers]);

  
  const prevVoiceUsers = useRef(null);

  useEffect(() => {
    if (!voiceUsers) return;

    if (prevVoiceUsers.current !== null) {
      const joined = voiceUsers.filter(u => !prevVoiceUsers.current.some(pu => pu.id === u.id));
      const left = prevVoiceUsers.current.filter(pu => !voiceUsers.some(u => u.id === pu.id));

      if (joined.length > 0) {
        playSoundEffect('join');
      } else if (left.length > 0) {
        playSoundEffect('leave');
      }
    }
    prevVoiceUsers.current = voiceUsers;
  }, [voiceUsers]);

  const joinVoice = async () => {
    if (!provider || !doc) return;

    try {
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStream.current = stream;

      
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContextClass();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        localAudioContext.current = audioCtx;
        localAnalyser.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        localSpeakingInterval.current = setInterval(() => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          const isSpeaking = average > 12; 

          const currentLocalState = provider.awareness.getLocalState()?.user;
          if (currentLocalState && currentLocalState.isSpeaking !== isSpeaking) {
            provider.awareness.setLocalStateField("user", {
              ...currentLocalState,
              isSpeaking
            });
          }
        }, 150);

      } catch (err) {
        console.warn("Failed to initialize local audio analyzer:", err);
      }

      
      const currentLocalState = provider.awareness.getLocalState()?.user;
      provider.awareness.setLocalStateField("user", {
        ...currentLocalState,
        inVoiceChannel: true,
        isMuted: false,
        isSpeaking: false
      });

      setJoinedVoice(true);
      setIsMuted(false);

    } catch (err) {
      console.error("Failed to access microphone for voice channel:", err);
      alert("Could not access microphone. Please ensure microphone permissions are granted.");
    }
  };

  const leaveVoice = () => {
    if (localSpeakingInterval.current) {
      clearInterval(localSpeakingInterval.current);
      localSpeakingInterval.current = null;
    }
    if (localAudioContext.current) {
      try {
        localAudioContext.current.close();
      } catch (e) {}
      localAudioContext.current = null;
    }
    localAnalyser.current = null;

    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }

    if (doc) {
      const signalingMap = doc.getMap("voice-signaling");
      Object.keys(peerConnections.current).forEach(peerId => {
        try {
          peerConnections.current[peerId].close();
        } catch (e) {}
        signalingMap.delete(`signal:${localUser?.id}:${peerId}`);
        signalingMap.delete(`signal:${peerId}:${localUser?.id}`);
      });
    }
    peerConnections.current = {};
    setRemoteTracks({});

    if (provider) {
      const currentLocalState = provider.awareness.getLocalState()?.user;
      if (currentLocalState) {
        provider.awareness.setLocalStateField("user", {
          ...currentLocalState,
          inVoiceChannel: false,
          isMuted: false,
          isSpeaking: false
        });
      }
    }

    setJoinedVoice(false);
  };

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);

        const currentLocalState = provider.awareness.getLocalState()?.user;
        if (currentLocalState) {
          provider.awareness.setLocalStateField("user", {
            ...currentLocalState,
            isMuted: !audioTrack.enabled
          });
        }
      }
    }
  };

  const playRemoteStream = (peerId, stream) => {
    setRemoteTracks(prev => ({
      ...prev,
      [peerId]: stream
    }));
  };

  const handleOffer = async (senderId, sdp) => {
    if (!localUser?.id || !doc) return;

    if (peerConnections.current[senderId]) {
      try {
        peerConnections.current[senderId].close();
      } catch (e) {}
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    peerConnections.current[senderId] = pc;

    if (localStream.current) {
      localStream.current.getTracks().forEach(track => {
        pc.addTrack(track, localStream.current);
      });
    }

    pc.ontrack = (event) => {
      playRemoteStream(senderId, event.streams[0]);
    };

    const signalingMap = doc.getMap("voice-signaling");
    pc.onicecandidate = (event) => {
      if (!event.candidate) {
        const answer = pc.localDescription;
        signalingMap.set(`signal:${localUser.id}:${senderId}`, JSON.stringify({
          type: 'answer',
          sdp: answer.sdp
        }));
      }
    };

    try {
      await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp }));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
    } catch (err) {
      console.error("Failed to handle offer from peer:", err);
    }
  };

  const handleAnswer = async (senderId, sdp) => {
    const pc = peerConnections.current[senderId];
    if (pc) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));
      } catch (err) {
        console.error("Failed to handle answer from peer:", err);
      }
    }
  };

  const initiateCall = async (peerId) => {
    if (!localUser?.id || !doc || peerConnections.current[peerId]) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    peerConnections.current[peerId] = pc;

    if (localStream.current) {
      localStream.current.getTracks().forEach(track => {
        pc.addTrack(track, localStream.current);
      });
    }

    pc.ontrack = (event) => {
      playRemoteStream(peerId, event.streams[0]);
    };

    const signalingMap = doc.getMap("voice-signaling");
    pc.onicecandidate = (event) => {
      if (!event.candidate) {
        const offer = pc.localDescription;
        signalingMap.set(`signal:${localUser.id}:${peerId}`, JSON.stringify({
          type: 'offer',
          sdp: offer.sdp
        }));
      }
    };

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
    } catch (err) {
      console.error("Failed to initiate call to peer:", err);
    }
  };

  useEffect(() => {
    if (!doc || !localUser?.id) return;

    const signalingMap = doc.getMap("voice-signaling");

    const processSignalKeys = (keys) => {
      keys.forEach((key) => {
        const val = signalingMap.get(key);
        if (!val) return;

        const parts = key.split(':');
        if (parts[0] !== 'signal' || parts.length < 3) return;

        const senderId = parts[1];
        const receiverId = parts[2];

        if (receiverId === localUser.id) {
          try {
            const signal = JSON.parse(val);
            if (signal.type === 'offer') {
              handleOffer(senderId, signal.sdp);
            } else if (signal.type === 'answer') {
              handleAnswer(senderId, signal.sdp);
            }
          } catch (e) {
            console.error("Failed to parse incoming voice signal:", e);
          }
        }
      });
    };

    // Process initial signals
    processSignalKeys(Array.from(signalingMap.keys()));

    const handleSignaling = (event) => {
      const changedKeys = [];
      event.changes.keys.forEach((change, key) => {
        if (change.action === 'add' || change.action === 'update') {
          changedKeys.push(key);
        }
      });
      processSignalKeys(changedKeys);
    };

    signalingMap.observe(handleSignaling);
    return () => {
      signalingMap.unobserve(handleSignaling);
    };
  }, [doc, localUser?.id]);

  useEffect(() => {
    if (!joinedVoice || !localUser?.id) return;

    voiceUsers.forEach(user => {
      if (user.id === localUser.id) return;

      if (!peerConnections.current[user.id]) {
        if (localUser.id < user.id) {
          initiateCall(user.id);
        }
      }
    });

    Object.keys(peerConnections.current).forEach(peerId => {
      const stillInVoice = voiceUsers.some(u => u.id === peerId);
      if (!stillInVoice) {
        try {
          peerConnections.current[peerId].close();
        } catch (e) {}
        delete peerConnections.current[peerId];
        
        setRemoteTracks(prev => {
          const next = { ...prev };
          delete next[peerId];
          return next;
        });

        if (doc) {
          const signalingMap = doc.getMap("voice-signaling");
          signalingMap.delete(`signal:${localUser.id}:${peerId}`);
          signalingMap.delete(`signal:${peerId}:${localUser.id}`);
        }
      }
    });
  }, [voiceUsers, joinedVoice, localUser?.id]);

  useEffect(() => {
    return () => {
      if (localSpeakingInterval.current) {
        clearInterval(localSpeakingInterval.current);
      }
      if (localAudioContext.current) {
        try {
          localAudioContext.current.close();
        } catch (e) {}
      }
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
      Object.keys(peerConnections.current).forEach(peerId => {
        try {
          peerConnections.current[peerId].close();
        } catch (e) {}
      });
    };
  }, []);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [contextMenu, setContextMenu] = useState(null);
  const [actionModal, setActionModal] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const openCreateFileModal = (basePath = '') => {
    setActionModal({
      type: 'createFile',
      title: 'New File',
      placeholder: 'e.g. src/utils/script.js',
      initialValue: basePath ? `${basePath}/` : ''
    });
  };

  const openCreateFolderModal = (basePath = '') => {
    setActionModal({
      type: 'createFolder',
      title: 'New Folder',
      placeholder: 'e.g. src/components',
      initialValue: basePath ? `${basePath}/` : ''
    });
  };

  const handleModalSubmit = (value) => {
    if (!value || !value.trim()) return;
    const val = value.trim();
    
    switch (actionModal.type) {
      case 'createFile':
        const language = getLanguageFromFilename(val);
        onAddFile(val, language);
        const parts = val.split('/');
        parts.pop();
        if (parts.length > 0) setExpandedFolders(prev => new Set([...prev, parts.join('/')]));
        break;
      case 'createFolder':
        const folderPath = val.replace(/\/+$/, '');
        onAddFile(`${folderPath}/.gitkeep`, 'plaintext');
        setExpandedFolders(prev => new Set([...prev, folderPath]));
        break;
      case 'rename':
        if (onRenameFile) onRenameFile(actionModal.path, val);
        break;
      case 'copy':
        if (onCopyFile) onCopyFile(actionModal.path, val);
        break;
      case 'move':
        if (onRenameFile) onRenameFile(actionModal.path, val);
        break;
    }
    setActionModal(null);
  };

  const handleContextMenu = (e, path, isFolder) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.pageX, y: e.pageY, path, isFolder });
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (onUploadFiles) {
        onUploadFiles(Array.from(e.target.files));
      }
      e.target.value = null; 
    }
  };

  const tree = useMemo(() => {
    const root = { name: 'root', type: 'folder', children: {}, path: '' };
    Object.keys(files).forEach(filePath => {
      const parts = filePath.split('/');
      let current = root;
      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        const currentPath = parts.slice(0, index + 1).join('/');
        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            type: isFile ? 'file' : 'folder',
            path: currentPath,
            children: {}
          };
        }
        current = current.children[part];
      });
    });
    return root;
  }, [files]);

  const toggleFolder = (folderPath) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
      }
      return next;
    });
  };

  const renderTree = (node, depth = 0) => {
    const entries = Object.values(node.children).sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'folder' ? -1 : 1;
    });

    return entries.map(item => {
      if (item.type === 'folder') {
        const isExpanded = expandedFolders.has(item.path);
        return (
          <div key={item.path}>
            <div 
              className="group flex items-center justify-between px-2 py-1 cursor-pointer text-sm transition-all duration-150 hover:bg-[#161b22] text-gray-400 hover:text-gray-200 border-l-2 border-transparent"
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              onClick={() => toggleFolder(item.path)}
              onContextMenu={(e) => handleContextMenu(e, item.path, true)}
            >
              <div className="flex items-center space-x-2 flex-1 overflow-hidden">
                <svg className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                <svg className="w-4 h-4 text-blue-400 opacity-80" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
                <span className="truncate text-xs font-medium">{item.name}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete folder ${item.name} and all its contents?`)) {
                    Object.keys(files).forEach(f => {
                       if (f === item.path || f.startsWith(item.path + '/')) {
                          onDeleteFile(f);
                       }
                    });
                  }
                }}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-1 rounded transition-all"
                title="Delete Folder"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
            {isExpanded && (
              <div>
                {renderTree(item, depth + 1)}
              </div>
            )}
          </div>
        );
      } else {
        if (item.name === '.gitkeep') return null;
        const isActive = activeFile === item.path;
        return (
          <div
            key={item.path}
            className={`group flex items-center justify-between px-2 py-1 cursor-pointer text-sm transition-all duration-150 border-l-2 ${
              isActive
                ? "bg-[#1f2428] text-green-400 border-green-500"
                : "text-gray-400 hover:bg-[#161b22] hover:text-gray-200 border-transparent"
            }`}
            style={{ paddingLeft: `${depth * 12 + 24}px` }}
            onClick={() => setActiveFile(item.path)}
            onContextMenu={(e) => handleContextMenu(e, item.path, false)}
          >
            <div className="flex items-center space-x-2 flex-1 overflow-hidden">
              <FileIcon fileName={item.name} />
              <span className="truncate text-xs">{item.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete ${item.name}?`)) {
                  onDeleteFile(item.path);
                }
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-1 rounded transition-all"
              title="Delete File"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        );
      }
    });
  };

  return (
    <div className="w-64 bg-[#0d1117] border-r border-gray-800 flex flex-col h-full flex-shrink-0 select-none">
      {}
      <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
      <input type="file" webkitdirectory="" directory="" multiple ref={folderInputRef} onChange={handleFileUpload} className="hidden" />

      <div className="flex items-center justify-between p-4 border-b border-gray-800/60 bg-[#0d1117]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="uppercase text-[11px] font-bold text-gray-500 tracking-widest">
          Explorer
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => openCreateFileModal()}
            className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer p-1 rounded-md hover:bg-gray-800"
            title="New File"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </button>
          <button 
            onClick={() => openCreateFolderModal()}
            className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer p-1 rounded-md hover:bg-gray-800"
            title="New Folder"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z"></path></svg>
          </button>
          <div className="w-px h-4 bg-gray-700 mx-1"></div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer p-1 rounded-md hover:bg-gray-800"
            title="Upload Files"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          </button>
          <button 
            onClick={() => folderInputRef.current?.click()}
            className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer p-1 rounded-md hover:bg-gray-800"
            title="Upload Folder"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m-3-3h6"></path></svg>
          </button>
          <div className="w-px h-4 bg-gray-700 mx-1"></div>
          <button 
            onClick={() => setShowGithubModal(true)}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-md hover:bg-gray-800"
            title="Import from GitHub"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {renderTree(tree)}
      </div>

      {}
      {Object.entries(remoteTracks).map(([peerId, stream]) => (
        <AudioPlayer key={peerId} stream={stream} />
      ))}

      {}
      <div className="border-t border-gray-800 bg-[#0d1117]/80 backdrop-blur-md flex-shrink-0 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <Volume2 className="w-4 h-4 text-green-500 animate-pulse" />
            <span>Voice Channel</span>
          </div>
          {joinedVoice && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </div>

        {!joinedVoice ? (
          <button
            onClick={joinVoice}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-green-900/20 active:scale-[0.98] cursor-pointer group"
          >
            <PhoneCall className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>Join Voice Room</span>
          </button>
        ) : (
          <div className="space-y-3">
            {}
            <div className="flex space-x-2">
              <button
                onClick={toggleMute}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 border rounded-xl transition-all cursor-pointer font-medium text-sm ${
                  isMuted
                    ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-green-400" />}
                <span>{isMuted ? "Muted" : "Mute"}</span>
              </button>
              <button
                onClick={leaveVoice}
                className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-red-600/10 hover:bg-red-600 hover:text-white border border-red-600/20 hover:border-red-600 text-red-400 rounded-xl transition-all cursor-pointer font-medium text-sm"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        )}

        {}
        {voiceUsers.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
              In Voice ({voiceUsers.length})
            </div>
            <div className="max-h-28 overflow-y-auto space-y-2">
              {voiceUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-1 px-2 hover:bg-white/5 rounded-lg transition-all">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Avatar 
                        src={user.avatar} 
                        name={user.name} 
                        email={user.email} 
                        className={`w-6 h-6 transition-all ${
                          user.isSpeaking && !user.isMuted
                            ? "ring-2 ring-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                            : ""
                        }`}
                        textClassName="text-[10px]"
                      />
                      {user.isSpeaking && !user.isMuted && (
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-300 font-medium truncate max-w-[100px]">
                      {user.name}
                    </span>
                  </div>
                  {user.isMuted && (
                    <MicOff className="w-3.5 h-3.5 text-red-500/70" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {}
      <div className="border-t border-gray-800 bg-[#0d1117] flex-shrink-0">
        <div 
          onClick={() => setShowActiveUsers(!showActiveUsers)}
          className="flex items-center justify-between p-4 pb-2 sticky top-0 bg-[#0d1117] z-10 cursor-pointer hover:bg-white/5 transition-colors select-none"
        >
          <div className="flex items-center space-x-2">
            {showActiveUsers ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            )}
            <div className="uppercase text-[11px] font-bold text-gray-500 tracking-widest">
              Active Users
            </div>
          </div>
          <div className="text-[10px] font-bold text-gray-400 bg-gray-800/80 px-2 py-0.5 rounded-full border border-gray-700/50">
            {activeUsers.length}
          </div>
        </div>
        
        {showActiveUsers && (
          <div className="px-3 pb-4 max-h-48 overflow-y-auto">
            {activeUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-3 py-2 px-2 hover:bg-[#161b22] rounded-lg transition-colors group cursor-default">
                <Avatar 
                  src={user.avatar} 
                  name={user.name} 
                  email={user.email}
                  className="w-7 h-7" 
                  textClassName="text-[11px]" 
                  borderClassName="ring-2 ring-[#0d1117] group-hover:ring-gray-800"
                />
                <span className="text-sm text-gray-300 truncate font-medium group-hover:text-white transition-colors">
                  {user.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {}
      {actionModal && (
        <ActionModal 
          title={actionModal.title}
          placeholder={actionModal.placeholder}
          initialValue={actionModal.initialValue}
          onSubmit={handleModalSubmit}
          onClose={() => setActionModal(null)}
        />
      )}

      {contextMenu && (
        <div 
          className="fixed z-50 bg-[#161b22] border border-gray-700 rounded-lg shadow-2xl py-1 text-sm text-gray-300 min-w-[160px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => { setActionModal({ type: 'rename', path: contextMenu.path, title: 'Rename', placeholder: 'New name...', initialValue: contextMenu.path }); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-[#1f2428] hover:text-white transition-colors">Rename</button>
          <button onClick={() => { setActionModal({ type: 'copy', path: contextMenu.path, title: 'Copy To', placeholder: 'Destination...', initialValue: contextMenu.path + ' copy' }); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-[#1f2428] hover:text-white transition-colors">Copy</button>
          <button onClick={() => { setActionModal({ type: 'move', path: contextMenu.path, title: 'Move To', placeholder: 'New path...', initialValue: contextMenu.path }); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-[#1f2428] hover:text-white transition-colors">Move</button>
          {contextMenu.isFolder && (
            <>
              <div className="h-px bg-gray-700 my-1 mx-2"></div>
              <button onClick={() => { openCreateFileModal(contextMenu.path); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-[#1f2428] hover:text-white transition-colors">New File</button>
              <button onClick={() => { openCreateFolderModal(contextMenu.path); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-[#1f2428] hover:text-white transition-colors">New Folder</button>
            </>
          )}
          <div className="h-px bg-gray-700 my-1 mx-2"></div>
          <button onClick={() => { 
             if (contextMenu.isFolder) {
                if (confirm(`Delete folder ${contextMenu.path} and its contents?`)) {
                   Object.keys(files).forEach(f => { if (f === contextMenu.path || f.startsWith(contextMenu.path + '/')) onDeleteFile(f); });
                }
             } else {
                if (confirm(`Delete ${contextMenu.path}?`)) onDeleteFile(contextMenu.path); 
             }
             setContextMenu(null); 
          }} className="w-full text-left px-4 py-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors">Delete</button>
        </div>
      )}
      {}
      {showGithubModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#161b22] border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-4">
              <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
              </svg>
              <h3 className="text-lg font-bold text-white">Import from GitHub</h3>
            </div>
            
            <form onSubmit={handleGithubImport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Repository URL or Path *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. facebook/react or https://github.com/..."
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  disabled={importingGithub}
                  className="w-full bg-[#0d1117] border border-gray-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Branch <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. main (leaves blank for default)"
                  value={githubBranch}
                  onChange={(e) => setGithubBranch(e.target.value)}
                  disabled={importingGithub}
                  className="w-full bg-[#0d1117] border border-gray-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                />
              </div>

              {importingGithub && (
                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl p-3.5 flex items-center space-x-3 text-xs">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
                  <span className="font-medium truncate max-w-[280px]">{importProgress}</span>
                </div>
              )}

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGithubModal(false)}
                  disabled={importingGithub}
                  className="flex-1 py-2 px-4 border border-gray-800 hover:bg-white/5 text-gray-300 rounded-xl font-medium text-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={importingGithub}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-blue-900/20 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Import</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const AudioPlayer = ({ stream }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;
    }
  }, [stream]);

  return <audio ref={audioRef} autoPlay playsInline style={{ display: 'none' }} />;
};

const playSoundEffect = async (type) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();
    
    // Explicitly resume context to bypass browser autoplay restrictions
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    // Premium Discord-style sounds
    if (type === 'join') {
      osc.type = 'sine';
      
      osc.frequency.setValueAtTime(440, now); // A4
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.5, now + 0.05);
      
      osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
      gainNode.gain.setValueAtTime(0.5, now + 0.12);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'leave') {
      osc.type = 'sine';
      
      osc.frequency.setValueAtTime(659.25, now); // E5
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.4, now + 0.05);
      
      osc.frequency.setValueAtTime(440, now + 0.12); // A4
      gainNode.gain.setValueAtTime(0.4, now + 0.12);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch (err) {
    console.warn("Failed to play voice channel sound effect:", err);
  }
};