export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="font-sans">
      {children}
    </section>
  );
}