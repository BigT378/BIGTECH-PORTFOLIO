import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Projects } from '@/components/Projects';
import { Services } from '@/components/Services';
import { GitHubSection } from '@/components/GitHubSection';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#050608]">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Services />
        <GitHubSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
