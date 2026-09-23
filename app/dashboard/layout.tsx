import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({children}:{children:React.ReactNode}) {
  return <div className="dashShell"><Sidebar/><main className="dashMain">{children}</main></div>;
}
