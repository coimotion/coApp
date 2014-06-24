# coApp
用來建立可控管（好維護、可擴充、效能好）的 HTML5 App。可快速接軌 COIMOTION API。原來是為 KSDG meetup 所寫的 demo，提供開發者參考。


## 如何使用
以 PhoneGap 建立專案後，將 coApp 所提供的 www 直接覆蓋 PhoneGap 所建立的 www 目錄。

### 新增頁面
頁面的原始檔放置於 www/blocks 目錄下。每個頁面需要一個代碼，假設某個頁面的代碼是 myPage，那麼請建立一個 www/blocks/myPage 的目錄，並將頁面所屬的 HTML 檔除存於 www/blocks/myPage/myPage.html。如果頁面需要相關的 javascript，那麼請將 js 檔放置於 www/blocks/myPage/myPage.js。

coapp.js 會在裝置啟動完成後自動建立網頁的先關設定，所以你必須告訴 coapp.js 在 app 中究竟有哪些頁面。作法是在 index.html 做如下的設定：

    <script type="text/javascript">
        var  pages = [
              {id: 'home'},
              {id: 'myPage', remote: 'WireNotes/notes/view', params: {pic:1}}
            ];

        _wf.initialize(pages);
    </script>

在上述的例子中，整個 app 共有二個頁面：home 和 myPage。其中 myPage 會向 COIMOTION 要求執行  WireNotes/notes/view 的 API 服務，並取得相關內容。params 則是呼叫 API 時的預設參數。

### 參考資料
這個[簡報檔](http://www.slideshare.net/BenLue/ksdg0621-share)有更多參考資訊。

## 注意事項
目前版本只針對 iOS 做設計。如果要在 Android 上正常執行，請在 coapp.css 加上適當的media query，以便處理不同的螢幕尺寸。

## Call For Contributors
coApp 一開始只是為了展示如何使用 COIMOTION 的 API 服務而建立，不過 coApp 事實上有很好的潛力可以不需原生碼（native code）就能建立反應速度快且功能強大的 app。

COIMOTION 團隊目前專注於後端服務（BaaS）的開發，不過我們樂於見到 coApp 能進一步發展成為 app 開發者的有效工具。所以如果有開發者有興趣協助 coApp 進一步的開發，歡迎和我們[聯繫](http://tw.coimotion.com/#content6)或討論。目前比較需要改善的部分包含頁面的過場效果、Android devices 的設定、以及 UI framework 的選用等。

## Release Note
0.0.2: 在 coapp.css 加上 media query，使不同的 iOS devices (iPhone, iPad) 能正常顯示。

0.0.1: 初次公告版本。