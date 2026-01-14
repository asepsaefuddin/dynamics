# Job Portal Application

## Overview
A full-stack job portal application with infinite scroll functionality, featuring a Next.js frontend and express.js backend.

## Installation

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
create .env ngambil contoh dari example.env
```

## Running the Application

### Backend
```bash
cd backend
npm start/dev
```

### Frontend
```bash
cd frontend
npm run dev
```

## Flow Infinite scroll
```
- Halaman **Job List** menggunakan `useInfiniteQuery` dari **@tanstack/react-query**. 
- Data pertama diambil saat halaman dimuat. - Saat user melakukan scroll ke bawah, **IntersectionObserver** memicu fetch data berikutnya. 
- Data baru ditambahkan ke list tanpa reload, sehingga daftar job terus bertambah mulus.
```

## Flow Proxy
```
- API proxy (backend URL tidak terekspos) ada di .env
- Semua request dari frontend diarahkan ke **Next.js Route Handler** (`/api/jobs`). 
- Route Handler bertindak sebagai **proxy**, meneruskan request ke backend Express. 
- Dengan cara ini, **URL backend tidak pernah terekspos di browser**.
```