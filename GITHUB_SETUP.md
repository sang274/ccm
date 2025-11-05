# Hướng dẫn đưa code lên GitHub từ Bolt.new

## ✅ Git đã được khởi tạo

Code của bạn đã được commit với message:
```
Initial commit: Carbon Credit Marketplace Frontend connected to .NET API
```

## 🚀 Cách 1: Sử dụng Bolt.new UI (Dễ nhất)

### Bước 1: Kết nối GitHub trong Bolt
1. Nhìn góc trên bên phải của Bolt.new
2. Tìm nút **"Connect to GitHub"** hoặc biểu tượng GitHub
3. Click để authorize Bolt.new với GitHub account của bạn

### Bước 2: Push code lên GitHub
1. Sau khi kết nối thành công, click **"Push to GitHub"**
2. Nhập tên repository: `carbon-credit-marketplace-frontend`
3. Chọn Public hoặc Private
4. Click **"Create Repository"**

✅ Code sẽ tự động được push lên GitHub!

---

## 🚀 Cách 2: Sử dụng Git commands (Thủ công)

### Bước 1: Tạo repository trên GitHub

1. Đi tới https://github.com/new
2. Repository name: `carbon-credit-marketplace-frontend`
3. Description: `React frontend for Carbon Credit Marketplace (connected to .NET API)`
4. Chọn Public hoặc Private
5. **KHÔNG** tick "Initialize with README" (vì đã có rồi)
6. Click **"Create repository"**

### Bước 2: Copy URL của repository

GitHub sẽ hiện ra URL như:
```
https://github.com/YOUR_USERNAME/carbon-credit-marketplace-frontend.git
```

### Bước 3: Push code lên GitHub

Trong terminal của Bolt, chạy:

```bash
# Thêm remote repository
git remote add origin https://github.com/YOUR_USERNAME/carbon-credit-marketplace-frontend.git

# Đổi tên branch thành main (nếu cần)
git branch -M main

# Push code lên GitHub
git push -u origin main
```

**Lưu ý:** Thay `YOUR_USERNAME` bằng username GitHub của bạn.

---

## 🚀 Cách 3: Sử dụng GitHub CLI (Advanced)

Nếu bạn có GitHub CLI:

```bash
# Login vào GitHub
gh auth login

# Tạo repository và push
gh repo create carbon-credit-marketplace-frontend --public --source=. --push
```

---

## 📝 Cấu trúc Repository sau khi push

```
carbon-credit-marketplace-frontend/
├── README.md                      # ⭐ Documentation
├── DOTNET_API_SETUP.md           # ⭐ Setup guide
├── PROJECT_STRUCTURE.md          # ⭐ Project structure
├── GITHUB_SETUP.md               # ⭐ This file
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── src/
    ├── config/
    ├── types/
    ├── services/
    ├── contexts/
    ├── components/
    └── ...
```

---

## 🔐 Lưu ý về Security

### File `.env` không được push lên GitHub
File `.env` đã được thêm vào `.gitignore` để bảo mật.

Trên GitHub, tạo file `.env.example`:
```env
VITE_API_BASE_URL=https://localhost:7001/api
```

Sau khi clone, người dùng cần:
```bash
cp .env.example .env
# Và cập nhật API URL
```

---

## 🎯 Sau khi push lên GitHub

### 1. Thêm GitHub Actions (Optional)
Tạo file `.github/workflows/build.yml` để auto build:

```yaml
name: Build and Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
```

### 2. Setup GitHub Pages (Optional)
Nếu muốn deploy lên GitHub Pages:

1. Đi tới Settings > Pages
2. Source: GitHub Actions
3. Tạo file `.github/workflows/deploy.yml`

### 3. Add Badge vào README
```markdown
![Build Status](https://github.com/YOUR_USERNAME/carbon-credit-marketplace-frontend/actions/workflows/build.yml/badge.svg)
```

---

## 🤝 Clone repository về máy local

Sau khi push lên GitHub, bất kỳ ai cũng có thể clone:

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/carbon-credit-marketplace-frontend.git

# Di chuyển vào folder
cd carbon-credit-marketplace-frontend

# Cài dependencies
npm install

# Tạo .env file
cp .env.example .env
# Cập nhật VITE_API_BASE_URL

# Chạy development server
npm run dev
```

---

## 🔄 Update code sau này

Khi bạn có thay đổi:

```bash
# Xem thay đổi
git status

# Add files
git add .

# Commit
git commit -m "feat: add new dashboard components"

# Push lên GitHub
git push
```

---

## 📱 Liên kết với Bolt.new

Sau khi push lên GitHub, bạn có thể:

1. **Import lại từ GitHub vào Bolt:**
   - Bolt.new > New Project > Import from GitHub
   - Chọn repository `carbon-credit-marketplace-frontend`

2. **Sync changes:**
   - Mọi thay đổi trong Bolt có thể push lên GitHub
   - Mọi thay đổi trên GitHub có thể pull về Bolt

---

## ✅ Checklist

- [ ] Git repository đã được init
- [ ] Code đã được commit
- [ ] GitHub repository đã được tạo
- [ ] Remote origin đã được thêm
- [ ] Code đã được push lên GitHub
- [ ] File `.env.example` đã được tạo
- [ ] README.md đã được cập nhật
- [ ] Repository đã được test clone về

---

## 🆘 Troubleshooting

### Lỗi: Permission denied
```bash
# Sử dụng HTTPS thay vì SSH
git remote set-url origin https://github.com/YOUR_USERNAME/repo.git
```

### Lỗi: Authentication failed
```bash
# Sử dụng Personal Access Token
# Tạo token tại: https://github.com/settings/tokens
# Username: your_github_username
# Password: ghp_xxxxxxxxxxxxx (token)
```

### Push bị reject
```bash
# Force push (chỉ dùng khi chắc chắn)
git push -f origin main
```

---

**🎉 Xong! Code của bạn đã có trên GitHub!**

Repository URL: `https://github.com/YOUR_USERNAME/carbon-credit-marketplace-frontend`
