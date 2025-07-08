import Navbar from "../components/navbar/Navbar.jsx";
import HeroFAQ from "../components/hero/HeroFAQ.jsx";
import Pertanyaan from "../components/FAQ/Pertanyaan.jsx";
import Footer from "../components/footer/Footer.jsx";

function FAQPage() {
  return (
    <>
        <Navbar />
        <HeroFAQ />
        <Pertanyaan />
        <Footer />
    </>
  );
}

export default FAQPage;
