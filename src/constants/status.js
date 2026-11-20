export const CASE_STATUS = {
  DILAPORKAN: { staffLabel: 'Perlu verifikasi', reporterLabel: 'Laporan diterima' },
  PERLU_DILENGKAPI: { staffLabel: 'Perlu dilengkapi', reporterLabel: 'Perlu dilengkapi' },
  PENELAAHAN: { staffLabel: 'Penelaahan', reporterLabel: 'Verifikasi selesai' },
  PEMERIKSAAN: { staffLabel: 'Pemeriksaan', reporterLabel: 'Sedang ditangani' },
  REKOMENDASI: { staffLabel: 'Menunggu keputusan', reporterLabel: 'Menunggu keputusan' },
  KEPUTUSAN: { staffLabel: 'Sanksi diputuskan', reporterLabel: 'Keputusan diterima' },
  PEMANTAUAN: { staffLabel: 'Pemantauan', reporterLabel: 'Sanksi diputuskan' },
  SELESAI: { staffLabel: 'Selesai', reporterLabel: 'Selesai' },
}

export function getStaffStatus(status) {
  return CASE_STATUS[status]?.staffLabel || status
}

export function getReporterStatus(status) {
  return CASE_STATUS[status]?.reporterLabel || status
}
