import Footer from "../components/footer/Footer.jsx";
import CTA from "../components/content/CTAHome.jsx";
import FAQHome from "../components/content/FAQHome.jsx";
import FiturUtamaHome from "../components/content/FiturUtamaHome.jsx";
import TentangHome from "../components/content/TentangHome.jsx";
import HeroHome from "../components/hero/HeroHome.jsx";
import Navbar from "../components/navbar/Navbar.jsx";

function HomePage() {
  return (
    <>
      <Navbar />
      <HeroHome />
      <TentangHome />
      <FiturUtamaHome />
      <FAQHome />
      <CTA />
      <Footer />
    </>
  );
}

export default HomePage;