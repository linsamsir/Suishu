export const MOODS = [
  { id: 'happy', label: '開心', gradient: 'from-yellow-200 to-orange-300', emoji: '😊' },
  { id: 'blessed', label: '幸福', gradient: 'from-pink-200 to-rose-300', emoji: '🥰' },
  { id: 'calm', label: '平靜', gradient: 'from-emerald-100 to-teal-200', emoji: '😌' },
  { id: 'excited', label: '興奮', gradient: 'from-amber-300 to-yellow-500', emoji: '🤩' },
  { id: 'sad', label: '難過', gradient: 'from-blue-200 to-indigo-300', emoji: '😢' },
  { id: 'anxious', label: '焦慮', gradient: 'from-slate-300 to-slate-400', emoji: '😰' },
  { id: 'angry', label: '生氣', gradient: 'from-red-300 to-red-500', emoji: '😡' },
  { id: 'tired', label: '累了', gradient: 'from-stone-300 to-stone-400', emoji: '😴' },
  { id: 'complex', label: '複雜', gradient: 'from-purple-200 to-indigo-400', emoji: '🤔' },
  { id: 'grateful', label: '感恩', gradient: 'from-lime-200 to-green-400', emoji: '🙏' },
  { id: 'expectant', label: '期待', gradient: 'from-cyan-200 to-blue-400', emoji: '✨' },
  { id: 'lonely', label: '孤單', gradient: 'from-indigo-100 to-slate-300', emoji: '☁️' },
];

export const SHICHEN = [
  { label: '子時', range: '23:00 - 01:00' },
  { label: '丑時', range: '01:00 - 03:00' },
  { label: '寅時', range: '03:00 - 05:00' },
  { label: '卯時', range: '05:00 - 07:00' },
  { label: '辰時', range: '07:00 - 09:00' },
  { label: '巳時', range: '09:00 - 11:00' },
  { label: '午時', range: '11:00 - 13:00' },
  { label: '未時', range: '13:00 - 15:00' },
  { label: '申時', range: '15:00 - 17:00' },
  { label: '酉時', range: '17:00 - 19:00' },
  { label: '戌時', range: '19:00 - 21:00' },
  { label: '亥時', range: '21:00 - 23:00' },
];

export const getShichen = (date: Date) => {
  const hour = date.getHours();
  if (hour >= 23 || hour < 1) return '子時';
  if (hour >= 1 && hour < 3) return '丑時';
  if (hour >= 3 && hour < 5) return '寅時';
  if (hour >= 5 && hour < 7) return '卯時';
  if (hour >= 7 && hour < 9) return '辰時';
  if (hour >= 9 && hour < 11) return '巳時';
  if (hour >= 11 && hour < 13) return '午時';
  if (hour >= 13 && hour < 15) return '未時';
  if (hour >= 15 && hour < 17) return '申時';
  if (hour >= 17 && hour < 19) return '酉時';
  if (hour >= 19 && hour < 21) return '戌時';
  return '亥時';
};

export const MOOD_QUOTES = [
  "每一天都是新的開始，加油！",
  "心情好，世界就美好。",
  "記得給自己一個擁抱。",
  "慢慢來，比較快。",
  "今天也辛苦了，早點休息吧。",
  "生活中的小確幸，值得被記錄。",
  "保持溫柔，世界會回報你溫暖。",
  "你比想像中更堅強。",
  "心情是彩虹，雨後總會出現。",
  "隨書記錄，留住當下的感動。",
];

export const TRANSLATIONS = {
  zh: {
    home: '首頁',
    calendar: '月曆',
    settings: '設定',
    about: '關於網站',
    title: '隨書 Suishu',
    subtitle: '溫暖記錄每一天',
    newEntry: '寫日記',
    viewEntry: '查看日記',
    editEntry: '編輯日記',
    mood: '今天的心情',
    photo: '照片記錄',
    upload: '點擊上傳照片',
    save: '儲存',
    delete: '刪除日記',
    security: '安全與隱私',
    pinLock: 'PIN 碼鎖定',
    data: '數據管理',
    export: '匯出備份 (JSON)',
    import: '匯入備份',
    clearAll: '清除所有資料',
    confirmClearAll: '確定要清除所有資料嗎？這將無法復原！',
    clearSuccess: '資料已全部清除',
    language: '顯示語言',
    itemsPerPage: '每頁顯示數量',
    aboutDesc: '網站說明',
    aboutGuide: '使用說明',
    aboutPrivacy: '隱私權及版權',
    installApp: '安裝應用程式',
    installDesc: '將隨書新增至桌面，體驗更佳',
    installBtn: '立即安裝',
    iosInstallTitle: 'iOS 安裝說明',
    iosInstallStep1: '1. 點擊瀏覽器下方的「分享」按鈕',
    iosInstallStep2: '2. 向下滑動並選擇「加入主畫面」',
    iosInstallStep3: '3. 點擊右上角的「新增」即可完成',
    installUrlNotice: '請確保您是在瀏覽器中直接開啟此網址，而非在預覽視窗中：',
    empty: '還沒有記錄呢，寫下今天的心情吧...',
    confirmDelete: '確定要刪除這篇日記嗎？',
    confirmImport: '確定要匯入數據嗎？這將會覆蓋現有數據。',
    pinSet: 'PIN 碼已設置',
    pinClear: '確定要清除 PIN 碼嗎？',
    pinInput: '請輸入 PIN 碼解鎖',
    pinPlaceholder: '4 位數字',
    moodStats: '心情分佈',
    noTitle: '無標題',
    statusEnabled: '已啟用',
    statusDisabled: '已關閉',
    statusLocked: '已鎖定',
    statusUnlocked: '已解鎖',
    statusNotSet: '未設置',
    change: '修改',
    set: '設置',
    clear: '清除',
    lock: '鎖定',
    unlock: '解鎖',
    aboutContent: {
      desc: {
        title: '隨書 Suishu',
        p1: '這是一個專為個人設計的私密日記空間。我們相信文字與心情的記錄能幫助人們更好地與自己對話。',
        p2: 'Suishu 採用本地存儲技術（IndexedDB），您的所有數據都保存在您的設備上，不會上傳到任何伺服器，確保絕對的隱私。'
      },
      guide: {
        title: '如何使用',
        items: [
          '點擊首頁右下角的「+」號開始撰寫新日記。',
          '您可以選擇今天的心情，這將幫助您日後進行篩選。',
          '點擊「照片記錄」可以上傳一張當天的照片。',
          '在設定中開啟 PIN 碼，可以為您的日記增加一層保護。',
          '定期使用「匯出備份」功能，確保您的珍貴回憶不會因設備更換而丟失。'
        ]
      },
      privacy: {
        title: '隱私權及版權',
        p1: '隱私權：本應用程式不收集任何個人資料。所有日記內容、照片及設定均存儲於瀏覽器的 IndexedDB 中。除非您主動使用匯出功能，否則數據不會離開您的設備。',
        p2: '版權：Suishu 隨書 應用程式及其設計、圖標、程式碼版權所有。用戶所撰寫的日記內容版權歸用戶個人所有。',
        footer: '© 2026 Suishu Team. All rights reserved.'
      },
      changelog: {
        title: '更新日誌',
        items: [
          { date: '2026/03/19', content: '新增「查看日記」唯讀模式，優化閱讀體驗與編輯流程。' },
          { date: '2026/03/17', content: '隨書 Suishu 正式版完成！包含圖文日記、心情統計、PIN 碼鎖定及多國語言支援。' }
        ]
      }
    },
    moods: {
      happy: '開心',
      blessed: '幸福',
      calm: '平靜',
      excited: '興奮',
      sad: '難過',
      anxious: '焦慮',
      angry: '生氣',
      tired: '累了',
      complex: '複雜',
      grateful: '感恩',
      expectant: '期待',
      lonely: '孤單'
    }
  },
  en: {
    home: 'Home',
    calendar: 'Calendar',
    settings: 'Settings',
    about: 'About',
    title: 'Suishu',
    subtitle: 'Warmly record every day',
    newEntry: 'New Diary',
    viewEntry: 'View Diary',
    editEntry: 'Edit Diary',
    mood: 'Mood Today',
    photo: 'Photo Record',
    upload: 'Click to upload',
    save: 'Save',
    delete: 'Delete',
    security: 'Security',
    pinLock: 'PIN Lock',
    data: 'Data Management',
    export: 'Export (JSON)',
    import: 'Import',
    clearAll: 'Clear All Data',
    confirmClearAll: 'Are you sure you want to clear all data? This cannot be undone!',
    clearSuccess: 'All data cleared successfully',
    language: 'Language',
    itemsPerPage: 'Items per page',
    aboutDesc: 'About Suishu',
    aboutGuide: 'User Guide',
    aboutPrivacy: 'Privacy & Copyright',
    installApp: 'Install App',
    installDesc: 'Add Suishu to home screen for better experience',
    installBtn: 'Install Now',
    iosInstallTitle: 'iOS Install Guide',
    iosInstallStep1: '1. Tap the "Share" button at the bottom',
    iosInstallStep2: '2. Scroll down and select "Add to Home Screen"',
    iosInstallStep3: '3. Tap "Add" in the top right corner',
    installUrlNotice: 'Make sure you open this URL directly in your browser, not in the preview window:',
    empty: 'No entries yet. How are you feeling today?',
    confirmDelete: 'Are you sure you want to delete this entry?',
    confirmImport: 'Are you sure you want to import? This will overwrite existing data.',
    pinSet: 'PIN set successfully',
    pinClear: 'Clear PIN lock?',
    pinInput: 'Enter PIN to unlock',
    pinPlaceholder: '4 digits',
    moodStats: 'Mood Distribution',
    noTitle: 'No Title',
    statusEnabled: 'Enabled',
    statusDisabled: 'Disabled',
    statusLocked: 'Locked',
    statusUnlocked: 'Unlocked',
    statusNotSet: 'Not Set',
    change: 'Change',
    set: 'Set',
    clear: 'Clear',
    lock: 'Lock',
    unlock: 'Unlock',
    aboutContent: {
      desc: {
        title: 'About Suishu',
        p1: 'This is a private diary space designed for individuals. We believe that recording words and moods helps people better converse with themselves.',
        p2: 'Suishu uses local storage technology (IndexedDB). All your data is saved on your device and will not be uploaded to any server, ensuring absolute privacy.'
      },
      guide: {
        title: 'How to Use',
        items: [
          'Click the "+" sign at the bottom right of the home page to start writing a new diary.',
          'You can choose your mood today, which will help you filter later.',
          'Click "Photo Record" to upload a photo of the day.',
          'Enable PIN code in settings to add a layer of protection to your diary.',
          'Use the "Export Backup" function regularly to ensure your precious memories are not lost due to device replacement.'
        ]
      },
      privacy: {
        title: 'Privacy & Copyright',
        p1: 'Privacy: This application does not collect any personal data. All diary content, photos, and settings are stored in the browser\'s IndexedDB. Unless you actively use the export function, data will not leave your device.',
        p2: 'Copyright: Suishu application and its design, icons, and code are copyrighted. The diary content written by users belongs to the users themselves.',
        footer: '© 2026 Suishu Team. All rights reserved.'
      },
      changelog: {
        title: 'Update History',
        items: [
          { date: '2026/03/19', content: 'Added "Diary Viewer" read-only mode, optimized reading and editing flow.' },
          { date: '2026/03/17', content: 'Suishu official version completed! Includes photo diaries, mood stats, PIN lock, and multi-language support.' }
        ]
      }
    },
    moods: {
      happy: 'Happy',
      blessed: 'Blessed',
      calm: 'Calm',
      excited: 'Excited',
      sad: 'Sad',
      anxious: 'Anxious',
      angry: 'Angry',
      tired: 'Tired',
      complex: 'Complex',
      grateful: 'Grateful',
      expectant: 'Expectant',
      lonely: 'Lonely'
    }
  },
  ja: {
    home: 'ホーム',
    calendar: 'カレンダー',
    settings: '設定',
    about: 'サイトについて',
    title: '随書 Suishu',
    subtitle: '毎日を温かく記録する',
    newEntry: '日記を書く',
    viewEntry: '日記を見る',
    editEntry: '日記を編集',
    mood: '今日の気分',
    photo: '写真の記録',
    upload: 'クリックしてアップロード',
    save: '保存',
    delete: '削除',
    security: 'セキュリティ',
    pinLock: 'PINロック',
    data: 'データ管理',
    export: 'エクスポート (JSON)',
    import: 'インポート',
    clearAll: 'すべてのデータを削除',
    confirmClearAll: 'すべてのデータを削除してもよろしいですか？この操作は取り消せません！',
    clearSuccess: 'すべてのデータが削除されました',
    language: '表示言語',
    itemsPerPage: '1ページあたりの表示数',
    aboutDesc: 'サイト説明',
    aboutGuide: '使い方',
    aboutPrivacy: 'プライバシーと著作権',
    installApp: 'アプリをインストール',
    installDesc: 'Suishuをホーム畫面に追加して、より良い體験を',
    installBtn: '今すぐインストール',
    iosInstallTitle: 'iOS インストールガイド',
    iosInstallStep1: '1. 畫面下の「共有」ボタンをタップします',
    iosInstallStep2: '2. 下にスクロールして「ホーム畫面に追加」を選択します',
    iosInstallStep3: '3. 右上の「追加」をタップして完了です',
    installUrlNotice: 'プレビューウィンドウではなく、ブラウザで直接このURLを開いていることを確認してください：',
    empty: 'まだ記録がありません。今日の気分を書きましょう...',
    confirmDelete: 'この日記を削除してもよろしいですか？',
    confirmImport: 'インポートしてもよろしいですか？既存のデータは上書きされます。',
    pinSet: 'PINコードが設定されました',
    pinClear: 'PINコードを解除しますか？',
    pinInput: 'PINコードを入力してください',
    pinPlaceholder: '4桁の数字',
    moodStats: '気分の分布',
    noTitle: '無題',
    statusEnabled: '有効',
    statusDisabled: '無効',
    statusLocked: 'ロック中',
    statusUnlocked: '解除中',
    statusNotSet: '未設定',
    change: '変更',
    set: '設定',
    clear: '解除',
    lock: 'ロック',
    unlock: '解除',
    aboutContent: {
      desc: {
        title: '随書 Suishuについて',
        p1: 'これは個人のために設計されたプライベートな日記スペースです。言葉と気分の記録は、人々が自分自身とより良く対話するのに役立つと信じています。',
        p2: 'Suishuはローカルストレージ技術（IndexedDB）を採用しています。すべてのデータはデバイスに保存され、サーバーにアップロードされることはありません。絶対的なプライバシーを保証します。'
      },
      guide: {
        title: '使い方',
        items: [
          'ホームページ右下の「+」をクリックして、新しい日記を書き始めます。',
          '今日の気分を選択できます。これは後でフィルタリングするのに役立ちます。',
          '「写真の記録」をクリックして、その日の写真をアップロードできます。',
          '設定でPINコードを有効にすると、日記に保護レイヤーを追加できます。',
          '定期的に「エクスポート」機能を使用して、デバイスの交換によって大切な思い出が失われないようにしてください。'
        ]
      },
      privacy: {
        title: 'プライバシーと著作権',
        p1: 'プライバシー：このアプリケーションは個人データを収集しません。すべての日記の内容、写真、設定はブラウザのIndexedDBに保存されます。エクスポート機能を使用しない限り、データがデバイスから離れることはありません。',
        p2: '著作権：Suishuアプリケーションとそのデザイン、アイコン、コードは著作権で保護されています。ユーザーが作成した日記の内容はユーザー自身に帰属します。',
        footer: '© 2026 Suishu Team. All rights reserved.'
      },
      changelog: {
        title: '更新履歴',
        items: [
          { date: '2026/03/19', content: '「日記を見る」読み取り専用モードを追加し、閲覧体験と編輯フローを最適化しました。' },
          { date: '2026/03/17', content: '隨書 Suishu 正式版が完成！日記、気分統計、PINロック、多言語対応を搭載。' }
        ]
      }
    },
    moods: {
      happy: 'ハッピー',
      blessed: '幸せ',
      calm: '穏やか',
      excited: 'ワクワク',
      sad: '悲しい',
      anxious: '不安',
      angry: '怒り',
      tired: '疲れ',
      complex: '複雑',
      grateful: '感謝',
      expectant: '期待',
      lonely: '寂しい'
    }
  }
};
