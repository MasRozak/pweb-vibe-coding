# 🏠 CampusStay - Student Housing Marketplace

## 📖 Deskripsi Singkat

CampusStay adalah platform marketplace khusus untuk membantu mahasiswa menemukan tempat kos/kontrakan di sekitar kampus dengan mudah dan cepat. Platform ini menghubungkan pemilik kos dengan mahasiswa yang sedang mencari hunian, mirip seperti Facebook Marketplace namun fokus pada student housing.

---

## 🎯 Masalah yang Diselesaikan (Problem Statement)

Mahasiswa, terutama mahasiswa baru, sering menghadapi kesulitan dalam mencari tempat kos yang:
- **Sulit ditemukan**: Informasi kos tersebar di berbagai platform (grup WA, Marketplace, dll)
- **Tidak transparan**: Kurangnya informasi detail tentang fasilitas dan harga
- **Ketersediaan tidak jelas**: Tidak tahu apakah kamar masih tersedia atau sudah penuh
- **Komunikasi terbatas**: Sulit berkomunikasi langsung dengan pemilik kos
- **Tidak ada rekomendasi**: Sulit menemukan kos alternatif dengan kriteria serupa

---

## 💡 Solusi yang Dibuat (Solution Overview)

CampusStay menyediakan platform terpusat dengan fitur-fitur utama:

### ✅ **Untuk Pemilik Kos:**
- Upload listing kos dengan multiple photos (max 5 foto)
- Kelola informasi detail (harga, lokasi, fasilitas, jumlah kamar)
- Update ketersediaan kamar secara real-time
- Terima dan balas pertanyaan dari calon penyewa via chat
- Edit & hapus listing kapan saja

### ✅ **Untuk Mahasiswa/Pencari Kos:**
- Browse semua listing kos yang tersedia
- Filter berdasarkan ketersediaan kamar
- Lihat detail lengkap (foto, harga, fasilitas, lokasi)
- Peringatan otomatis jika kamar hampir penuh
- Sistem rekomendasi berdasarkan lokasi dan harga
- Chat langsung dengan pemilik kos
- Lihat riwayat chat di satu tempat

---

## 🛠️ Tech Stack & Fitur Utama

### **Backend (REST API)**
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database & ODM
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Multer** - Multiple image upload handling
- **CORS** - Cross-origin resource sharing

### **Frontend (Web Application)**
- **React.js** (Vite) - UI framework
- **React Router v6** - Routing & navigation
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Styling & responsive design
- **React Hot Toast** - User notifications

### **Fitur Unggulan**

#### 🔐 **Authentication & Authorization**
- Register & Login dengan JWT
- Protected routes untuk fitur tertentu
- Auto-attach token pada setiap request

#### 🏘️ **Listing Management (CRUD)**
- Create listing dengan **multiple images** (max 5)
- Upload & display images dari server
- Update listing (termasuk ganti foto)
- Delete listing & auto-delete semua foto terkait
- Validasi ownership (hanya owner yang bisa edit/delete)

#### 📊 **Room Availability System**
- Field **availableRooms** & **totalRooms**
- Badge peringatan **"Tinggal X kamar!"** (warna kuning) jika ≤ 3 kamar
- Badge **"PENUH"** (warna merah) jika kamar habis
- Alert box besar di detail page dengan status real-time

#### 🏷️ **Facilities Tagging**
- Checkbox facilities: WiFi, AC, Parking, Laundry, Kitchen, Bathroom
- Display sebagai badge di detail page

#### 🎯 **Recommendation System**
- Algoritma rekomendasi berdasarkan:
  - Lokasi yang sama
  - Range harga ±30%
  - Hanya listing dengan kamar tersedia
- Tampil 4 rekomendasi di bawah detail page

#### 💬 **Real-time Chat System**
- Chat langsung antara pemilik kos & pencari kos
- Tombol chat **hanya muncul di listing orang lain**
- Owner bisa membalas chat yang masuk
- Auto-refresh setiap 3 detik
- Notifikasi unread messages
- Riwayat percakapan tersimpan per listing

---

## 🚀 Cara Menjalankan Project (Setup Instructions)

### **Prerequisites**
- Node.js (v16 atau lebih baru)
- MongoDB (lokal atau MongoDB Atlas)
- Git

### **1. Clone Repository**
```bash
git clone <repository-url>
cd pweb-vibe
```

### **2. Setup Backend**

```bash
# Masuk ke folder backend
cd BE

# Install dependencies
npm install

# Buat file .env dan isi dengan:
PORT=5000
MONGO_URI=mongodb://localhost:27017/campusstay
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Jalankan server
npm start
```

Server akan berjalan di: `http://localhost:5000`

### **3. Setup Frontend**

Buka terminal baru:

```bash
# Masuk ke folder frontend
cd FE

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di: `http://localhost:5173` atau `http://localhost:5174`

### **4. Test Aplikasi**

1. **Register** akun baru di `/register`
2. **Login** dengan akun yang sudah dibuat
3. **Create Listing** - Upload foto kos, isi detail, pilih fasilitas
4. **Browse Listings** - Lihat semua kos yang tersedia
5. **View Detail** - Klik listing untuk melihat detail lengkap
6. **Chat** - Klik tombol chat di listing orang lain
7. **Messages** - Lihat semua percakapan di menu Messages

---

## 📁 Struktur Folder

```
pweb-vibe/
├── BE/                          # Backend API
│   ├── config/                  # Database configuration
│   ├── controllers/             # Business logic (auth, listing, message)
│   ├── models/                  # Mongoose schemas (User, Listing, Message)
│   ├── routes/                  # API endpoints
│   ├── middleware/              # Auth middleware (JWT verification)
│   ├── uploads/                 # Uploaded images storage
│   ├── server.js                # Express app entry point
│   └── .env                     # Environment variables
│
└── FE/                          # Frontend React App
    ├── src/
    │   ├── components/          # Reusable components (Navbar, ListingCard)
    │   ├── pages/               # Page components (Home, Login, Chat, etc)
    │   ├── context/             # React Context (AuthContext)
    │   ├── utils/               # Helper functions (axiosInstance)
    │   ├── App.jsx              # Main app with routing
    │   └── main.jsx             # Entry point
    ├── public/                  # Static assets
    └── index.html               # HTML template
```

---

## 🎨 Screenshot Fitur Utama

### Dashboard / Home
- Grid layout listing kos dengan foto thumbnail
- Badge "Tinggal X kamar" atau "PENUH"
- Info harga dan jumlah kamar tersedia

### Detail Listing
- Image gallery dengan navigasi
- Alert ketersediaan kamar (hijau/kuning/merah)
- Badge fasilitas
- Tombol chat (hanya untuk non-owner)
- Rekomendasi kos serupa

### Chat System
- Bubble chat dengan timestamp
- Auto-refresh percakapan
- Info listing di atas chat

### Messages
- List semua percakapan
- Unread badge
- Preview pesan terakhir

---

## 🔑 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user

### **Listings**
- `GET /api/listings` - Get semua listings (public)
- `GET /api/listings/:id` - Get listing detail (public)
- `POST /api/listings` - Create listing (protected)
- `PUT /api/listings/:id` - Update listing (protected, owner only)
- `DELETE /api/listings/:id` - Delete listing (protected, owner only)
- `GET /api/listings/recommendations/:id` - Get recommended listings

### **Messages**
- `GET /api/messages` - Get all conversations (protected)
- `GET /api/messages/:listingId/:userId` - Get conversation (protected)
- `POST /api/messages` - Send message (protected)
- `DELETE /api/messages/:id` - Delete message (protected, sender only)

---

## 👥 Tim Pengembang

Dibuat oleh mahasiswa untuk membantu sesama mahasiswa menemukan tempat tinggal yang nyaman di sekitar kampus.

---

## 📝 Lisensi

MIT License - Bebas digunakan untuk keperluan edukasi dan pengembangan.

---

## 🙏 Acknowledgments

- Desain inspirasi dari Facebook Marketplace & Airbnb
- Icon dari Emoji Unicode
- Tailwind CSS untuk styling yang cepat dan responsive
