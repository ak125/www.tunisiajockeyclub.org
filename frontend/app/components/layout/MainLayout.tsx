import { useState } from "react";
import { Outlet } from "@remix-run/react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "../Navbar";
import { Header } from "../Header";

interface MainLayoutProps {
  children?: React.ReactNode;
  showNavbar?: boolean;
  showSidebar?: boolean;
  useSemanticHeader?: boolean;
}

export function MainLayout({ 
  children, 
  showNavbar = true, 
  showSidebar = true,
  useSemanticHeader = true
}: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Par défaut ouverte

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header sémantique ou Navbar classique */}
      {useSemanticHeader ? (
        <Header />
      ) : (
        showNavbar && <Navbar logo="" />
      )}
      
      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <>
            {/* Bouton toggle mobile */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="fixed top-20 left-4 z-60 p-2 bg-white rounded-lg shadow-lg border border-gray-200 lg:hidden"
              aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {/* Sidebar Component */}
            <Sidebar 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)} 
            />
            
            {/* Spacer pour desktop pour compenser la sidebar fixe */}
            <div className="w-72 flex-shrink-0" />
          </>
        )}
        
        {/* Contenu principal */}
        <main 
          className={`
            flex-1 min-h-screen
            ${showNavbar || useSemanticHeader ? 'pt-4' : ''}
          `}
          role="main"
          aria-label="Contenu principal"
        >
          <div className="p-4 lg:p-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
