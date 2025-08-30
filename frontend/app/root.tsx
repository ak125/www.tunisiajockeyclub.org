import { type RemixService } from "@fafa/backend";
import { type LinksFunction, type LoaderFunctionArgs, json } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteLoaderData } from "@remix-run/react";
import { Footer } from "./components/Footer";
import { MainLayout } from "./components/layout/MainLayout";
import { QueryProvider } from "./shared/providers/QueryProvider";
import { ErrorBoundary as AppErrorBoundary } from "./shared/components/ErrorBoundary";
import { Toaster } from "react-hot-toast";
import "./global.css";
import "./styles/design-system.css";
import logo from "./routes/_assets/logo-automecanik-dark.png";
import { getOptionalUser } from "./utils/auth.server";

export const links: LinksFunction = () => [];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getOptionalUser(request);
  return json({ 
    user
    });
};

export const useOptionalUser = () => {
  const data = useRouteLoaderData<typeof loader>("root");

  if (!data) {
    throw new Error('Root loader was not run');
  }
  return data.user;
}

declare module "@remix-run/node" {
  interface AppLoadContext {
    remixService: RemixService; // Changed from 'any' to 'RemixService'
    user: unknown
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-50">
        <MainLayout>
          <AppErrorBoundary>
            <QueryProvider>
              {children}
            </QueryProvider>
          </AppErrorBoundary>
        </MainLayout>
        <Footer />
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
              style: {
                border: '1px solid #22c55e',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              style: {
                border: '1px solid #ef4444',
              },
            },
          }}
        />
        
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}