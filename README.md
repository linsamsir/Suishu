# 隨書 Suishu 📖

溫暖記錄每一天。一個專為個人設計的私密、本地優先（Local-first）日記應用程式。

![Suishu Banner](https://picsum.photos/seed/suishu/1200/400)

## ✨ 特色功能

- **🔒 隱私至上**：所有數據均儲存在瀏覽器的 IndexedDB 中，絕不上傳伺服器。
- **😊 心情追蹤**：12 種精緻的心情圖示與漸層背景，記錄當下的情感。
- **📸 影像留存**：每篇日記可上傳一張照片，留住珍貴瞬間。
- **📅 歷史回顧**：直觀的列表與月曆視圖，輕鬆瀏覽過往點滴。
- **🛡️ 安全鎖定**：支援 PIN 碼鎖定功能，保護您的私密空間。
- **📊 數據管理**：支援 JSON 格式的匯出與匯入，備份遷移超簡單。
- **🌍 多國語言**：支援 繁體中文、英文、日文。
- **📱 PWA 支援**：可安裝至手機主畫面，享受原生 App 般的體驗。

## 🛠️ 技術棧

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **Database**: Dexie.js (IndexedDB)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns, lunar-javascript (農曆支援)

## 🚀 快速開始

### 本地開發

1. **複製專案**
   ```bash
   git clone https://github.com/your-username/suishu.git
   cd suishu
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

### 部署

由於本專案不依賴後端資料庫，您可以將其部署為靜態網站：

1. **構建專案**
   ```bash
   npm run build
   ```
2. 將 `dist` 資料夾中的內容上傳至 GitHub Pages、Vercel、Netlify 或任何靜態託管平台。

## 📝 授權條款

本專案採用 MIT 授權條款。您可以自由使用、修改和分發。

---
© 2026 Suishu Team. Made with ❤️ for a better self-conversation.
