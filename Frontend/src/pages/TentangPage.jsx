import Navbar from "../components/navbar/Navbar.jsx";
import HeroTentang from "../components/hero/HeroTentang.jsx";
import KenapaOrderlink from "../components/tentang/KenapaOrderlink.jsx";
import CaraKerja from "../components/tentang/CaraKerja.jsx";
import Footer from "../components/footer/Footer.jsx";

function TentangPage() {
  return (
    <>
      <Navbar />
      <HeroTentang />
      <KenapaOrderlink />
      <CaraKerja />
      <Footer />
    </>
  );
}

export default TentangPage;
