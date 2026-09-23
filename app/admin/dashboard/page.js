export const metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminDashboardPage() {
  return (
    <div className="container-custom py-16">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    </div>
  );
}
