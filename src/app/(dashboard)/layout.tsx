import { IsStaffProvider } from "@/providers/OrgProvider";
import Sidebar from "@/components/cms/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <IsStaffProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </IsStaffProvider>
  );
}
