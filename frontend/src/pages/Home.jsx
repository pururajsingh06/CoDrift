import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Code2, 
  Users, 
  Zap, 
  Shield, 
  Terminal, 
  MessageSquare, 
  Github,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import useAuthStore from "../store/useAuthStore";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const createRoom = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/dashboard');
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Real-time Sync",
      description: "Experience ultra-low latency collaboration powered by Yjs and WebSockets."
    },
    {
      icon: <Users className="w-6 h-6 text-blue-400" />,
      title: "Multi-user Presence",
      description: "See remote cursors, selections, and user activity in real-time."
    },
    {
      icon: <Terminal className="w-6 h-6 text-green-400" />,
      title: "Built-in Runner",
      description: "Execute your code instantly with our isolated execution environment."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-purple-400" />,
      title: "In-editor Chat",
      description: "Communicate with your team without leaving the development environment."
    },
    {
      icon: <Shield className="w-6 h-6 text-red-400" />,
      title: "Secure Sessions",
      description: "End-to-end encrypted rooms ensure your code remains private and safe."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
      title: "AI Assistance",
      description: "Get smart suggestions and code completions as you build together."
    }
  ];

  return (
    <div className="bg-[#0d1117] min-h-screen text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-300">New: Version 2.0 is now live</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8"
            >
              Code Together.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500">
                Drift Faster.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              The ultra-fast, collaborative code editor for modern development teams. 
              Built for speed, simplicity, and seamless cooperation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <button
                onClick={createRoom}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-xl shadow-green-900/40 flex items-center justify-center space-x-3 active:scale-95 group"
              >
                <span>Start Coding Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <Link
                to="/register"
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-8 rounded-xl transition-all border border-white/10 flex items-center justify-center space-x-3 active:scale-95"
              >
                <Github className="w-5 h-5" />
                <span>Star on GitHub</span>
              </Link>
            </motion.div>
          </div>

          {/* Editor Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-24 relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-green-500/20 blur-[100px] -z-10 rounded-3xl" />
            <div className="bg-[#161b22] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-[#0d1117] border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-xs text-gray-500 font-mono">collaborative-session.js</div>
                <div className="w-12" />
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed">
                <div className="flex space-x-4">
                  <span className="text-gray-600">1</span>
                  <span className="text-purple-400">import</span>
                  <span className="text-blue-400">{" { "}</span>
                  <span className="text-white">CoDrift</span>
                  <span className="text-blue-400">{" } "}</span>
                  <span className="text-purple-400">from</span>
                  <span className="text-green-400"> '@codrift/core'</span>
                  <span className="text-white">;</span>
                </div>
                <div className="flex space-x-4 mt-1">
                  <span className="text-gray-600">2</span>
                </div>
                <div className="flex space-x-4 mt-1">
                  <span className="text-gray-600">3</span>
                  <span className="text-blue-400">const</span>
                  <span className="text-white"> session = </span>
                  <span className="text-purple-400">new</span>
                  <span className="text-yellow-400"> CoDrift</span>
                  <span className="text-white">();</span>
                </div>
                <div className="flex space-x-4 mt-1">
                  <span className="text-gray-600">4</span>
                  <span className="text-white">session.</span>
                  <span className="text-yellow-400">on</span>
                  <span className="text-white">(</span>
                  <span className="text-green-400">'collaboration'</span>
                  <span className="text-white">, (</span>
                  <span className="text-blue-400">peers</span>
                  <span className="text-white">) ={"> "}</span>
                  <span className="text-blue-400">{"{"}</span>
                </div>
                <div className="flex space-x-4 mt-1">
                  <span className="text-gray-600">5</span>
                  <span className="ml-4 text-white">console.</span>
                  <span className="text-yellow-400">log</span>
                  <span className="text-white">(</span>
                  <span className="text-green-400">`Coding with $</span>
                  <span className="text-blue-400">{"{peers.length}"}</span>
                  <span className="text-green-400"> others!`</span>
                  <span className="text-white">);</span>
                </div>
                <div className="flex space-x-4 mt-1">
                  <span className="text-gray-600">6</span>
                  <span className="text-blue-400">{"}"}</span>
                  <span className="text-white">);</span>
                </div>
              </div>
            </div>
            
            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-10 -right-10 bg-[#1c2128] border border-white/10 p-4 rounded-xl shadow-xl backdrop-blur-md hidden lg:block"
            >
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#1c2128]" />
                  <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-[#1c2128]" />
                  <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#1c2128]" />
                </div>
                <div className="text-xs font-medium text-gray-300">5+ Developers Active</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#0d1117] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Everything you need to ship.</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Built for high-performance teams who demand the best collaborative experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-[#161b22] border border-white/5 p-8 rounded-2xl hover:border-green-500/30 transition-all group"
              >
                <div className="bg-[#0d1117] w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/5 border border-green-500/20 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">Ready to accelerate your workflow?</h2>
            <button
              onClick={createRoom}
              className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-xl shadow-green-900/30 active:scale-95"
            >
              Create Your First Room
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;