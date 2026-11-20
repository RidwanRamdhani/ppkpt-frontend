# Platform Manajemen Pelaporan Kasus PPKPT

Frontend React/Vite untuk portal pelaporan dan penanganan kasus PPKPT Telkom University.

## Menjalankan

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_USE_MOCK=true` untuk data dummy atau `false` untuk memakai API pada `VITE_API_BASE_URL`.

## Build dan lint

```bash
npm run build
npm run lint
```

## Struktur

- `src/pages` — halaman berdasarkan role
- `src/layouts` — layout publik dan petugas
- `src/components/ui` — komponen antarmuka reusable
- `src/features` — formulir laporan dan detail kasus
- `src/services` — API client dan lapisan mock
- `src/constants` — status, role, dan pilihan aplikasi
