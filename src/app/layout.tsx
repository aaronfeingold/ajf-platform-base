import "./globals.css";
import SidebarWrapper from "@/components/Sidebar/SidebarWrapper";
import { StoreProvider } from "@/components/Providers/StoreProvider";

export const metadata = {
  title: "Ariba Dashboard",
  description: "Investor-ready dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-white">
        <StoreProvider>
          <div className="flex h-screen">
            <SidebarWrapper>{children}</SidebarWrapper>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
