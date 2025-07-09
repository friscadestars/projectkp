import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import HomePage from "./pages/HomePage.jsx";
import TentangPage from "./pages/TentangPage.jsx";
import FiturPage from "./pages/FiturPage.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import MasukPage from "./pages/MasukPage.jsx";
import RegistrasiPage from "./pages/RegistrasiPage.jsx"
import BerandaAgen from "./pages/beranda/BerandaAgen.jsx";
import BerandaPabrik from "./pages/beranda/BerandaPabrik.jsx";
import BerandaDistributor from "./pages/beranda/BerandaDistributor.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes*/}
        <Route path="/" element={<HomePage />} />
        <Route path="/tentang" element={<TentangPage />} />
        <Route path="/fitur" element={<FiturPage />} />
        <Route path="/faq" element={<FAQPage />} />

        {/* Auth */}
        <Route path="/masuk" element={<MasukPage />} />
        <Route path="/registrasi" element={<RegistrasiPage />} />

        {/* Private Routes */}
        <Route path="/berandaAgen" element={<BerandaAgen />} />
        <Route path="/berandaPabrik" element={<BerandaPabrik />} />
        <Route path="/berandaDistributor" element={<BerandaDistributor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;