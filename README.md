


# Cogito Backend

Repositori ini berisi backend dari proyek **Cogitu**, yang terdiri dari beberapa komponen utama untuk menangani model analitik, integrasi model LLM, dan server API utama.

## Struktur Folder

```
cogito-backend/
├── analytical-setup/           # Setup model analitik (Python)
│   └── fallacy_detector_model/ # Model
│   ├── .gitignore
│   └── app.py                  # Entry point
│
├── llama-setup/               # Integrasi dengan LLM (JavaScript/Node.js)
│   ├── node_modules/
│   ├── src/                    # Kode sumber untuk LLM wrapper/handler
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── server-api/                # Backend utama (Node.js/Express)
│   ├── migrations/             # Berisi skrip migrasi database
│   ├── node_modules/
│   ├── scripts/                # Skrip tambahan
│   ├── src/                    # Kode utama aplikasi
│   ├── .env
│   ├── .env.test
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
```

## Requirements

### analytical-setup (Python)

* Python >= 3.8
* Library seperti `flask`, `transformers`, dll (Lebih lengkap di `./fallacy_detector_model/requirements.py`)

### llama-setup & server-api (Node.js)

* Node.js >= 18.x
* npm


## Persiapan Model

Sebelum menjalankan proyek, pastikan model sudah ditempatkan di direktori berikut:

* **LLM Model** untuk `llama-setup/models`: [Download di Google Drive]([https://drive.google.com/your-llama-model-link](https://drive.google.com/file/d/1s0heZxDeNMjEMmox8Kr996BDyLFTFFxb/view?usp=drive_link))
* **Fallacy Detection Model** untuk `analytical-setup/fallacy_detector_model`: [Download di Google Drive]([https://drive.google.com/your-fallacy-model-link](https://drive.google.com/file/d/1GuTuHzaYnP82evxqF-kUOLq9xfLIDHj1/view?usp=sharing))

Silakan ekstrak file model ke direktori yang sesuai setelah mengunduhnya.

## Cara Menjalankan

### 1. Jalankan analytical-setup

```bash
cd analytical-setup
pip install -r ./fallacy_detector_model/requirements.py
python app.py
```

### 2. Jalankan llama-setup

```bash
cd llama-setup
npm install
npm start
```

### 3. Jalankan server-api

```bash
cd server-api
npm install
npm run migrate up
npm start
```


## Catatan

* Pastikan file `.env` tersedia di setiap komponen (`llama-setup` dan `server-api`).
* Pastikan file `.env` tersedia di setiap komponen (`llama-setup` dan `server-api`).
* Untuk testing bisa menggunakan file `.env.test` di `server-api`.
* Struktur bisa berubah tergantung implementasi final.

## Lisensi

MIT License
