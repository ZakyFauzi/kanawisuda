# 🌊 The Deep Sea Graduation Odyssey

Sebuah web-app interaktif satu halaman sebagai kado wisuda digital dengan tema **Underwater Exploration**.

![Preview](assets/img/preview.png)

## ✨ Fitur

| Stage | Nama | Deskripsi |
|-------|------|-----------|
| 1 | **The Abyssal Gate** | Landing page dengan animasi gelembung & password "siap" |
| 2 | **The Coral Conversation** | Chat interaktif dengan Nemo (min. 25 kata) |
| 3 | **The Nautical Photobox** | Ambil 3 foto dengan template frame custom |
| 4 | **The Treasure Chest** | Hasil akhir + download kenangan |

## 🎨 Tema & Estetika

- **Palet Warna:** Deep Ocean Blue, Turquoise, Coral Pink, Sand Yellow
- **Efek:** Glassmorphism, animated bubbles, confetti celebration
- **Font:** Poppins & Montserrat (Google Fonts)

## 🛠️ Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- [Tailwind CSS](https://tailwindcss.com/) (CDN)
- [html2canvas](https://html2canvas.hertzen.com/) - Screenshot photobox
- [canvas-confetti](https://github.com/catdad/canvas-confetti) - Efek perayaan
- [Lucide Icons](https://lucide.dev/) - Ikon
- [AOS](https://michalsnik.github.io/aos/) - Scroll animations

## 📂 Struktur Folder

```
kanawisuda/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── script.js
    │   ├── chat-logic.js
    │   └── camera.js
    └── img/
        └── KANAAAAAAAA.png  (photobox frame template)
```

## 🚀 Cara Menjalankan

### Production (Recommended)
Deploy ke hosting seperti:
- [Netlify](https://netlify.com)
- [Vercel](https://vercel.com)
- [GitHub Pages](https://pages.github.com)

### Development (Local Server)
```bash
# Menggunakan npx
npx serve .

# Atau Python
python -m http.server 8000
```

> ⚠️ **Catatan:** Buka lewat `file://` lokal akan menyebabkan error CORS pada photobox. Gunakan local server atau deploy online.

## 📸 Photobox Template

Template `KANAAAAAAAA.png` harus memiliki area transparan untuk 3 slot foto dengan rasio 4:3.

**Spesifikasi foto:**
- Resolusi: 800 x 600 px
- Rasio: 4:3
- Mode: Selfie (mirrored)

## 🎮 Cara Main

1. Buka website
2. Ketik **"siap"** untuk mulai menyelam
3. Chat dengan Nemo, ceritakan pengalamanmu (min. 25 kata)
4. Ambil 3 foto di photobox
5. Generate & download hasilnya!

## 📝 Lisensi

Made with 💙 untuk wisuda Kak Kana
