import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import HomePage from "./pages/HomePage.jsx";
import TentangPage from "./pages/TentangPage.jsx";
import FiturPage from "./pages/FiturPage.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import MasukPage from "./pages/MasukPage.jsx";
import BerandaAgen from "./pages/beranda/BerandaAgen.jsx";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tentang" element={<TentangPage />} />
        <Route path="/fitur" element={<FiturPage />} />
        <Route path="/faq" element={<FAQPage />} />

        <Route path="/masuk" element={<MasukPage />} />

        <Route path="/berandaAgen" element={<BerandaAgen />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;