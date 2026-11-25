import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import StaffLayout from './layouts/StaffLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import HomePage from './pages/public/HomePage'
import LoginPage from './pages/auth/LoginPage'
import { ROLES } from './constants/roles'
import { ReportProvider } from './features/report-form/ReportContext'
import ReportWizard from './pages/public/ReportWizard'
import ReportSuccessPage from './pages/public/ReportSuccessPage'
import StatusCheckPage from './pages/public/StatusCheckPage'
import StatusResultPage from './pages/public/StatusResultPage'
import CompleteReportPage from './pages/public/CompleteReportPage'
import DashboardPage from './pages/satgas/DashboardPage'
import CasesPage from './pages/satgas/CasesPage'
import ManualEntryPage from './pages/satgas/ManualEntryPage'
import CaseDetailPage from './features/case-detail/CaseDetailPage'

function StaffPage({ title }) {
  return <div className="card" style={{ padding: 28 }}><h1 style={{ fontSize: 28, margin: '0 0 8px' }}>{title}</h1><p style={{ color: 'var(--muted)' }}>Implementasi halaman pada fase berikutnya.</p></div>
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/lapor" element={<ReportProvider><ReportWizard /></ReportProvider>} />
        <Route path="/lapor/berhasil" element={<ReportSuccessPage />} />
        <Route path="/cek-status" element={<StatusCheckPage />} />
        <Route path="/status" element={<StatusResultPage />} />
        <Route path="/status/lengkapi" element={<CompleteReportPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute allowedRoles={[ROLES.SATGAS]}><StaffLayout /></ProtectedRoute>}>
        <Route path="/satgas/dashboard" element={<DashboardPage />} />
        <Route path="/satgas/kasus" element={<CasesPage />} />
        <Route path="/satgas/kasus/:id" element={<CaseDetailPage />} />
        <Route path="/satgas/input-manual" element={<ManualEntryPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.PEJABAT]}><StaffLayout /></ProtectedRoute>}>
        <Route path="/pejabat/kasus" element={<StaffPage title="Daftar Kasus Pejabat" />} />
        <Route path="/pejabat/kasus/:id" element={<StaffPage title="Rekomendasi Kasus" />} />
        <Route path="/pejabat/dashboard" element={<StaffPage title="Dashboard Pejabat" />} />
        <Route path="/pejabat/riwayat" element={<StaffPage title="Riwayat Keputusan" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
