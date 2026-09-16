import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isReservationOpen: boolean;
  openReservation: () => void;
  closeReservation: () => void;
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  isGatewayEntered: boolean;
  setGatewayEntered: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGatewayEntered, setIsGatewayEntered] = useState(false);

  return (
    <UIContext.Provider
      value={{
        isReservationOpen,
        openReservation: () => setIsReservationOpen(true),
        closeReservation: () => setIsReservationOpen(false),
        isMobileMenuOpen,
        openMobileMenu: () => setIsMobileMenuOpen(true),
        closeMobileMenu: () => setIsMobileMenuOpen(false),
        isGatewayEntered,
        setGatewayEntered: () => setIsGatewayEntered(true),
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
};
