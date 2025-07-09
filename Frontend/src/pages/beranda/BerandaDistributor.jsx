import NavbarPrivate from "../../components/private/navbar/NavbarPrivate.jsx";
import HeroDistributor from "../../components/private/distributor/HeroDistributor.jsx";
import ContentDistributor from "../../components/private/distributor/ContentDistributor.jsx";
import Footer from "../../components/footer/Footer.jsx";

function BerandaDistributor() {
  return (
    <>
        <NavbarPrivate />
        <HeroDistributor />
        <ContentDistributor />
        <Footer />
    </>
  );
}

export default BerandaDistributor;
