import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Users, Zap, Shield, ChevronRight, Terminal, Globe, Cpu } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/useAuthStore';

const About = () => {
  const { isAuthenticated } = useAuthStore();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white overflow-hidden relative">
      <Navbar />

      {}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        
        {}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full text-green-400 text-sm font-semibold mb-6">
            <Code2 className="w-4 h-4" />
            <span>Behind the Scenes</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            Collaborative Coding <br />
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Without the Friction
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            CoDrift was designed to bring developers closer together. By leveraging state-of-the-art real-time collaboration engines, CoDrift delivers a latency-free, highly responsive workspace for modern teams.
          </p>
        </motion.div>

        {}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
        >
          {[
            {
              icon: <Users className="w-6 h-6 text-green-400" />,
              title: "Real-Time Synergy",
              desc: "Collaborate instantly on any project. See where your peers are editing with distinct cursor tracking, awareness tags, and zero-conflict synchronization."
            },
            {
              icon: <Zap className="w-6 h-6 text-emerald-400" />,
              title: "Lightning Fast Execution",
              desc: "Compile and execute code workspaces straight from your browser. With server-side multi-file execution systems, wait time is virtually zero."
            },
            {
              icon: <Shield className="w-6 h-6 text-teal-400" />,
              title: "Durable Infrastructure",
              desc: "Your code is automatically saved and backed up. LevelDB persistence layers guarantee that your workspace state remains completely intact even on connection drops."
            }
          ].map((pillar, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-[#161b22] border border-white/5 p-8 rounded-2xl hover:border-green-500/20 hover:shadow-lg hover:shadow-green-950/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0d1117] border border-white/10 flex items-center justify-center mb-6 group-hover:border-green-500/30 transition-colors">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-green-400 transition-colors">{pillar.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {}
        <div className="bg-[#161b22] border border-white/5 rounded-3xl p-8 sm:p-12 mb-24 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Terminal className="text-green-400 w-8 h-8" />
                <span>Our Technical Core</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                CoDrift is built upon a highly optimized stack, merging speed, durability, and a clean developer experience. Here's what makes the magic possible:
              </p>

              <div className="space-y-4">
                {[
                  { label: "Yjs CRDT Engine", detail: "Conflict-Free Replicated Data Types ensure seamless updates." },
                  { label: "Monaco Editor Integration", detail: "Powered by the same robust core driving Visual Studio Code." },
                  { label: "Prisma & SQLite", detail: "Safe, type-safe database architectures with local persistence." },
                  { label: "WebSocket Real-Time Server", detail: "Dedicated web socket protocol layer to stream local updates." }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 mt-1 flex-shrink-0">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{item.label}</h4>
                      <p className="text-gray-500 text-xs mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-6 font-mono text-xs text-gray-400 shadow-inner max-h-[300px] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/40" />
                </div>
                <span className="text-[10px] text-gray-500">codrift-sys.log</span>
              </div>
              <div className="space-y-2">
                <p className="text-green-500">[system] initializing collaborative session...</p>
                <p className="text-gray-500">[yjs] establishing connection on ws://127.0.0.1:1234</p>
                <p className="text-green-400">[yjs] connection successfully synced.</p>
                <p className="text-gray-500">[persistence] loading room records via Prisma Client...</p>
                <p className="text-gray-500">[leveldb] LevelDB state sync running (durable write committed)</p>
                <p className="text-blue-400">[security] JWT auth verification passed (User Session: Active)</p>
                <p className="text-yellow-500">[compiler] workspace multi-file target identified: index.js</p>
                <p className="text-green-400">[compile] code output generated successfully in 23ms.</p>
                <p className="text-green-500">[system] all nodes operating at peak efficiency.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Experience the Shift?</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Create your permanent rooms, gather your team, and start coding together. Real-time development, persistent workspaces.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-green-900/20 active:scale-95 text-center w-full sm:w-auto"
            >
              {isAuthenticated ? "Launch Workspace" : "Get Started Free"}
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-3 rounded-xl transition-all active:scale-95 text-center w-full sm:w-auto"
              >
                Sign In
              </Link>
            )}
          </div>
        </motion.div>

      </main>
    </div>
  );
};

export default About;
