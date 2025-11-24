import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ShopifyProjects from '../components/ShopifyProjects';

const Home = () => {
  return (
    <div className="scroll-smooth">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <ShopifyProjects />
      <Contact />
    </div>
  );
};

export default Home;