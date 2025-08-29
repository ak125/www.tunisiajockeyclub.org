import { Outlet } from "@remix-run/react";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";

interface SimpleLayoutProps {
  children?: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export function SimpleLayout({ 
  children, 
  showNavbar = true, 
  showFooter = true 
}: SimpleLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showNavbar && <Navbar logo="" />}
      
      <main className={`flex-1 ${showNavbar ? 'pt-4' : ''}`}>
        {children || <Outlet />}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}
