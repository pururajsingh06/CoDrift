import React, { useState } from 'react';

const Avatar = ({ src, name, email, className = "w-8 h-8", textClassName = "text-xs", borderClassName = "" }) => {
  const [hasError, setHasError] = useState(false);

  const initial = name ? name.charAt(0).toUpperCase() : '?';

  const isDefaultGoogleOrEmpty = !src || src.toLowerCase().includes('default-user') || src.trim() === '';

  const getGradient = () => {
    const palettes = [
      'from-green-500 to-emerald-700',
      'from-blue-500 to-indigo-700',
      'from-purple-500 to-pink-700',
      'from-rose-500 to-red-700',
      'from-amber-500 to-orange-700',
      'from-cyan-500 to-blue-700',
      'from-teal-500 to-emerald-700',
      'from-violet-500 to-purple-700',
      'from-pink-500 to-rose-700',
      'from-fuchsia-500 to-violet-700',
    ];

    const hashString = email || name || '';
    if (!hashString) {
      return palettes[0]; // default to emerald
    }

    let hash = 0;
    for (let i = 0; i < hashString.length; i++) {
      hash = hashString.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % palettes.length;
    return palettes[index];
  };

  if (isDefaultGoogleOrEmpty || hasError) {
    const gradient = getGradient();
    return (
      <div 
        className={`rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${gradient} shadow-sm transition-all ${borderClassName} ${className}`}
      >
        <span className={textClassName}>{initial}</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={name || "User Avatar"} 
      onError={() => setHasError(true)}
      className={`rounded-full object-cover shadow-sm transition-all ${borderClassName} ${className}`}
    />
  );
};

export default Avatar;
