
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-base-200 shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
          AI Photo Editor
        </h1>
      </div>
    </header>
  );
};

export default Header;
