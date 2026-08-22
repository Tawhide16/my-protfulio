import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import ShopifyProjects from '@/components/ShopifyProjects';
import Contact from '@/components/Contact';

export default function HomePage() {
  return (
    <div className="scroll-smooth" suppressHydrationWarning>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <ShopifyProjects />
      <Contact />
    </div>
  );
}
