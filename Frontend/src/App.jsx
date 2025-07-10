import { Routes, Route } from 'react-router-dom';
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
import DashboardAgen from './pages/Agen/DashboardAgen.jsx';
import RingkasanOrder from './pages/Agen/RingkasanOrder.jsx';
import FormPermintaanOrder from './pages/Agen/FormPermintaanOrder.jsx';
import RiwayatOrder from './pages/Agen/RiwayatOrder.jsx';
import DetailOrder from './pages/Agen/DetailOrder.jsx';
import TagihanOrder from './pages/Agen/Tagihan.jsx';
import InvoiceTagihan from './pages/Agen/InvoiceTagihan.jsx';

// Distributor Pages
import DashboardDistributor from './pages/Distributor/DashboardDistributor.jsx';
import ValidasiOrder from './pages/Distributor/ValidasiOrder.jsx';
import DetailValidasiOrder from './pages/Distributor/DetailValidasiOrder.jsx';
import KirimOrderKePabrik from './pages/Distributor/KirimOrderKePabrik.jsx';
import DetailKirimOrderKePabrik from './pages/Distributor/DetailKirimOrderKePabrik.jsx';
import MonitoringOrder from './pages/Distributor/MonitoringOrder.jsx';
import DetailMonitoringOrder from './pages/Distributor/DetailMonitoringOrder.jsx';
import MonitoringAgen from './pages/Distributor/MonitoringAgen.jsx';
import DaftarHargaPabrik from './pages/Distributor/PabrikPriceList.jsx';
import DaftarHargaDistributor from './pages/Distributor/DistributorPriceList.jsx';
import RiwayatOrderDistributor from './pages/Distributor/RiwayatOrderDistributor.jsx';
import DetailRiwayatOrder from './pages/Distributor/DetailRiwayatOrder.jsx';
import TagihanDistributor from './pages/Distributor/TagihanDistributor.jsx';
import InvoiceTagihanDistributor from './pages/Distributor/InvoiceTagihanDistributor.jsx';

function App() {
  return (
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
  );
}

export default App;
