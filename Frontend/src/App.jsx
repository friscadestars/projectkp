// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Public Pages
import HomePage from './pages/HomePage.jsx';
import TentangPage from './pages/TentangPage.jsx';
import FiturPage from './pages/FiturPage.jsx';
import FAQPage from './pages/FAQPage.jsx';

// Auth Pages
import MasukPage from './pages/MasukPage.jsx';
import RegistrasiPage from './pages/RegistrasiPage.jsx';

// Beranda Pages
import BerandaAgen from './pages/beranda/BerandaAgen.jsx';
import BerandaPabrik from './pages/beranda/BerandaPabrik.jsx';
import BerandaDistributor from './pages/beranda/BerandaDistributor.jsx';

// Agen Pages
import DashboardAgen from './Pages/Agen/DashboardAgen';
import RingkasanOrder from './Pages/Agen/RingkasanOrder';
import FormPermintaanOrder from './Pages/Agen/FormPermintaanOrder';
import RiwayatOrder from './Pages/Agen/RiwayatOrder';
import DetailOrder from './Pages/Agen/DetailOrder';
import TagihanOrder from './Pages/Agen/Tagihan';
import InvoiceTagihan from './Pages/Agen/InvoiceTagihan';

// Distributor Pages
import DashboardDistributor from './Pages/Distributor/DashboardDistributor';
import ValidasiOrder from './Pages/Distributor/ValidasiOrder';
import DetailValidasiOrder from './Pages/Distributor/DetailValidasiOrder';
import KirimOrderKePabrik from './Pages/Distributor/KirimOrderKePabrik';
import DetailKirimOrderKePabrik from './Pages/Distributor/DetailKirimOrderKePabrik';
import MonitoringOrder from './Pages/Distributor/MonitoringOrder';
import DetailMonitoringOrder from './Pages/Distributor/DetailMonitoringOrder';
import MonitoringAgen from './Pages/Distributor/MonitoringAgen';
import DaftarHargaPabrik from './Pages/Distributor/PabrikPriceList';
import DaftarHargaDistributor from './Pages/Distributor/DistributorPriceList';
import RiwayatOrderDistributor from './Pages/Distributor/RiwayatOrderDistributor';
import DetailRiwayatOrder from './Pages/Distributor/DetailRiwayatOrder';
import TagihanDistributor from './Pages/Distributor/TagihanDistributor';
import InvoiceTagihanDistributor from './Pages/Distributor/InvoiceTagihanDistributor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/tentang" element={<TentangPage />} />
        <Route path="/fitur" element={<FiturPage />} />
        <Route path="/faq" element={<FAQPage />} />

        {/* Auth */}
        <Route path="/masuk" element={<MasukPage />} />
        <Route path="/registrasi" element={<RegistrasiPage />} />

        {/* Beranda */}
        <Route path="/berandaAgen" element={<BerandaAgen />} />
        <Route path="/berandaPabrik" element={<BerandaPabrik />} />
        <Route path="/berandaDistributor" element={<BerandaDistributor />} />

        {/* Agen Routes */}
        <Route path="/agen/dashboard-agen" element={<DashboardAgen />} />
        <Route path="/agen/ringkasan-order" element={<RingkasanOrder />} />
        <Route path="/agen/permintaan-order" element={<FormPermintaanOrder />} />
        <Route path="/agen/riwayat-order" element={<RiwayatOrder />} />
        <Route path="/agen/detail-order" element={<DetailOrder />} />
        <Route path="/agen/tagihan" element={<TagihanOrder />} />
        <Route path="/agen/invoice-tagihan" element={<InvoiceTagihan />} />

        {/* Distributor Routes */}
        <Route path="/distributor/dashboard-distributor" element={<DashboardDistributor />} />
        <Route path="/distributor/validasi-order" element={<ValidasiOrder />} />
        <Route path="/distributor/detail-validasi/:orderId" element={<DetailValidasiOrder />} />
        <Route path="/distributor/kirim-order" element={<KirimOrderKePabrik />} />
        <Route path="/distributor/detail-kirim/:orderId" element={<DetailKirimOrderKePabrik />} />
        <Route path="/distributor/monitoring-order" element={<MonitoringOrder />} />
        <Route path="/distributor/monitoring-order/detail/:orderId" element={<DetailMonitoringOrder />} />
        <Route path="/distributor/monitoring-agen" element={<MonitoringAgen />} />
        <Route path="/distributor/daftar-harga-pabrik" element={<DaftarHargaPabrik />} />
        <Route path="/distributor/daftar-harga-distributor" element={<DaftarHargaDistributor />} />
        <Route path="/distributor/riwayat-order" element={<RiwayatOrderDistributor />} />
        <Route path="/distributor/riwayat-order/detail/:orderId" element={<DetailRiwayatOrder />} />
        <Route path="/distributor/tagihan" element={<TagihanDistributor />} />
        <Route path="/distributor/invoice/:orderId" element={<InvoiceTagihanDistributor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
