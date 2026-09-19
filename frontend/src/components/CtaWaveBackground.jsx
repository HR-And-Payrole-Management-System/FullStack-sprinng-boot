export default function CtaWaveBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1024 640"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      style={{ pointerEvents: "none" }}
    >
      <g stroke="#FFFFFF" strokeOpacity="0.12" fill="none">
        <path d="M-50,420 C150,340 350,500 550,430 S900,300 1080,380" strokeWidth="2" />
        <path d="M-50,460 C180,390 380,540 560,470 S920,340 1080,420" strokeWidth="2" />
        <path d="M-50,500 C200,440 400,580 580,510 S940,380 1080,460" strokeWidth="1.5" />
      </g>
      <g stroke="#FFFFFF" strokeOpacity="0.08" fill="none">
        <path d="M-50,120 C200,60 300,220 500,160 S850,20 1080,90" strokeWidth="1.5" />
        <path d="M-50,150 C220,90 320,250 520,190 S870,50 1080,120" strokeWidth="1.5" />
      </g>
      <g stroke="#FFFFFF" strokeOpacity="0.06" fill="none">
        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={i}
            d={`M${300 + i * 6},0 L${420 + i * 6},260`}
            strokeWidth="1"
          />
        ))}
      </g>
    </svg>
  );
}