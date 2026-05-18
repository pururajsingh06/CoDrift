import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code2, Users, FolderTree, Cpu, Share2, 
  ShieldCheck, LayoutDashboard, UserCheck, 
  Sparkles, CheckCircle2, ChevronRight 
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/useAuthStore';

const Features = () => {
  const { isAuthenticated } = useAuthStore();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
  };

  const featuresList = [
    {
      icon: <Users className="w-8 h-8 text-green-400" />,
      title: "Real-Time Collaboration",
      desc: "Synchronize your entire project document seamlessly with conflict-free Yjs architecture. Share remote cursors, selections, and presence in real-time.",
      badge: "State-of-the-Art"
    },
    {
      icon: <FolderTree className="w-8 h-8 text-emerald-400" />,
      title: "Full File Workspace Explorer",
      desc: "Rename, delete, copy, and move files directly inside the editor sidebar. Right-click to manage your complex folder structures effortlessly.",
      badge: "Power Tool"
    },
    {
      icon: <Cpu className="w-8 h-8 text-teal-400" />,
      title: "Sandbox Workspace Execution",
      desc: "Run multi-file workspaces immediately in a server-side execution pipeline. Seamlessly compile imports and modules with immediate console outputs.",
      badge: "High Performance"
    },
    {
      icon: <LayoutDashboard className="w-8 h-8 text-cyan-400" />,
      title: "Durable Room persistence",
      desc: "Enjoy automatic synchronization of your documents backed by SQLite Prisma pipelines and LevelDB. Revisit and edit active sessions anytime.",
      badge: "Cloud-Backed"
    },
    {
      icon: <UserCheck className="w-8 h-8 text-purple-400" />,
      title: "Custom User Profiles",
      desc: "Fully personalize your identity. Customize your display names, secure credentials, and profile picture states directly inside account dashboards.",
      badge: "Identity"
    },
    {
      icon: <Share2 className="w-8 h-8 text-indigo-400" />,
      title: "Social Friends Network",
      desc: "Search, discover, and add team members securely. Send pending invites, approve connections, and construct a robust developer team graph.",
      badge: "New"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-white relative overflow-hidden">
      <Navbar />

      {}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-green-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        
        {}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-emerald-400 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Powering Professional Teams</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            Features Tailored For <br />
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              High-Velocity Collaboration
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            CoDrift packs all the features of a desktop IDE and supercharges them with web-based real-time synchronicity and high-availability cloud storage.
          </p>
        </motion.div>

        {}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
        >
          {featuresList.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-[#161b22] border border-white/5 p-8 rounded-2xl hover:border-green-500/20 hover:shadow-xl hover:shadow-green-950/5 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#0d1117] border border-white/10 flex items-center justify-center group-hover:border-green-500/30 transition-colors">
                    {feature.icon}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 group-hover:border-green-500/20 group-hover:text-green-400 transition-colors">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {feature.desc}
                </p>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-green-400 font-semibold transition-colors mt-auto cursor-pointer">
                <span>Explore Tech Specs</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {}
        <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-white/10 rounded-3xl p-8 sm:p-12 mb-24 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-teal-500/10 border border-teal-500/20 px-3.5 py-1.5 rounded-full text-teal-400 text-xs font-semibold mb-6">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Trust Environment</span>
              </div>
              <h2 className="text-3xl font-bold mb-6">Enterprise-Grade Security</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                We believe collaboration shouldn't compromise speed or security. CoDrift incorporates industry standard safety measures at every stage:
              </p>
              
              <ul className="space-y-4">
                {[
                  "JWT (JSON Web Tokens) to strictly secure API communication layers.",
                  "State-of-the-art secure password salting & hashing utilizing Bcrypt algorithms.",
                  "One-click secure OAuth credentials (Google & GitHub) integration.",
                  "Isolated sandboxed environments for safe code workspace compiling."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-8 shadow-xl max-w-sm w-full relative">
                <div className="h-2.5 w-2.5 rounded-full bg-green-400 absolute top-4 right-4 animate-pulse" />
                <h4 className="font-bold text-white mb-2">Collaboration Health</h4>
                <p className="text-xs text-gray-500 mb-6">Real-time telemetry and network stats</p>
                
                <div className="space-y-4">
                  {[
                    { label: "Document Sync Latency", val: "8ms", color: "text-green-400" },
                    { label: "Compiler Execution Time", val: "0.18s", color: "text-green-400" },
                    { label: "WebSocket Keepalive Status", val: "Operational", color: "text-green-400" },
                    { label: "Active Peer-to-Peer Tunneling", val: "Enabled", color: "text-teal-400" }
                  ].map((stat, sIdx) => (
                    <div key={sIdx} className="flex justify-between items-center text-xs py-2 border-b border-white/5">
                      <span className="text-gray-400">{stat.label}</span>
                      <span className={`font-semibold ${stat.color}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Start Coding Together Today</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            Invite your team members, create collaborative code workspaces, and experience the velocity of CoDrift.
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-green-900/20 active:scale-95"
          >
            <span>Launch Workspace</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </main>
    </div>
  );
};

export default Features;
