

/**
 * Loading — 全頁載入動畫（幾何圖形版）
 *
 * 以多個半透明幾何圖形（三角、正方、六邊形、菱形、圓形）
 * 進行旋轉、縮放、位移等動態變化，搭配品牌主色系
 * （indigo / purple / pink）呈現視覺節奏感。
 */

export default function Loading() {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-6">

        {/* ── 幾何圖形動畫容器 ── */}
        <div className="relative w-40 h-40">

          {/* 外層：緩慢順時針旋轉的正方形（品牌靛色） */}
          <div
            className="absolute inset-2 border-2 border-brand-primary/40 rounded-lg"
            style={{ animation: "geo-rotate 4s linear infinite" }}
          />

          {/* 中層：逆時針旋轉的菱形（品牌紫色） */}
          <div
            className="absolute inset-6 border-2 border-brand-secondary/50"
            style={{
              animation: "geo-rotate-reverse 3s linear infinite",
              transform: "rotate(45deg)",
            }}
          />

          {/* 內層：脈動縮放的圓形（品牌粉色） */}
          <div
            className="absolute inset-10 rounded-full border-2 border-brand-accent/40"
            style={{ animation: "geo-pulse 2s ease-in-out infinite" }}
          />

          {/* 中心 SVG 組合：三角形 + 六邊形 */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 160 160"
            fill="none"
          >
            {/* 旋轉三角形（靛色） */}
            <polygon
              points="80,30 110,100 50,100"
              stroke="#6366f1"
              strokeWidth="1.5"
              opacity="0.5"
              style={{
                transformOrigin: "80px 80px",
                animation: "geo-rotate 5s linear infinite",
              }}
            />

            {/* 逆時針旋轉六邊形（紫色） */}
            <polygon
              points="80,45 105,57 105,83 80,95 55,83 55,57"
              stroke="#a855f7"
              strokeWidth="1.5"
              opacity="0.45"
              style={{
                transformOrigin: "80px 70px",
                animation: "geo-rotate-reverse 6s linear infinite",
              }}
            />

            {/* 呼吸縮放的小菱形（粉色） */}
            <polygon
              points="80,60 95,75 80,90 65,75"
              stroke="#ec4899"
              strokeWidth="1.5"
              opacity="0.5"
              style={{
                transformOrigin: "80px 75px",
                animation: "geo-breathe 3s ease-in-out infinite",
              }}
            />
          </svg>

          {/* 四角裝飾光點 */}
          <span
            className="absolute top-0 left-0 w-2 h-2 rounded-full bg-brand-primary/60"
            style={{ animation: "geo-dot 3s ease-in-out infinite" }}
          />
          <span
            className="absolute top-0 right-0 w-2 h-2 rounded-full bg-brand-secondary/60"
            style={{ animation: "geo-dot 3s ease-in-out 0.75s infinite" }}
          />
          <span
            className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-brand-accent/60"
            style={{ animation: "geo-dot 3s ease-in-out 1.5s infinite" }}
          />
          <span
            className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-brand-primary/40"
            style={{ animation: "geo-dot 3s ease-in-out 2.25s infinite" }}
          />
        </div>

        {/* ── 載入文字 ── */}
        <p
          className="text-sm font-medium tracking-widest text-slate-400"
          style={{ animation: "geo-fade-text 2s ease-in-out infinite" }}
        >
          LOADING QUANT.OS
        </p>
      </div>

      {/* ── 內嵌關鍵影格動畫 ── */}
      <style>{`
        /* 順時針旋轉 */
        @keyframes geo-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        /* 逆時針旋轉 */
        @keyframes geo-rotate-reverse {
          from { transform: rotate(45deg); }
          to   { transform: rotate(-315deg); }
        }
        /* 脈動縮放（圓形） */
        @keyframes geo-pulse {
          0%, 100% { transform: scale(1);   opacity: 0.4; }
          50%      { transform: scale(1.15); opacity: 0.8; }
        }
        /* 呼吸縮放（菱形） */
        @keyframes geo-breathe {
          0%, 100% { transform: scale(1);   opacity: 0.5; }
          50%      { transform: scale(1.2); opacity: 0.9; }
        }
        /* 光點閃爍 */
        @keyframes geo-dot {
          0%, 100% { transform: scale(1);   opacity: 0.3; }
          50%      { transform: scale(1.8); opacity: 1;   }
        }
        /* 文字淡入淡出 */
        @keyframes geo-fade-text {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
