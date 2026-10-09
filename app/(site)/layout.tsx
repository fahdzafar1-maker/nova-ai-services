import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ChatAssistant } from "@/components/ChatAssistant";
import { Analytics } from "@/components/Analytics";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main id="main" className="relative">{children}</main>
      <Footer />
      <ChatAssistant />
      <Analytics />
    </>
  );
}
