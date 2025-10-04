import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Gamepad2, Sword, Map, Users, ShoppingCart } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Gamepad2 },
    { path: '/characters', label: 'Characters', icon: Users },
    { path: '/quests', label: 'Quests', icon: Map },
    { path: '/arena', label: 'Arena', icon: Sword },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Gamepad2 size={32} />
          <span>ChainQuest</span>
        </div>
        
        <nav className="nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <Icon size={18} style={{ marginRight: '0.5rem' }} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;