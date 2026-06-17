export default function FileUploadAnimation() {
  return (
    <svg className="feat-upload" viewBox="0 0 340 230" fill="none" aria-hidden="true">
      <path
        className="feat-upload-folder"
        d="M40,150 v-70 h50 l16,18 h140 v52 z M40,150 h206 v36 h-206 z"
        strokeLinejoin="round"
      />
      <g className="feat-upload-file">
        <rect x="-16" y="-20" width="32" height="40" rx="4" />
        <path d="M-16,-20 h20 l12,12 v28 h-32 z" className="feat-upload-file-fold" />
        <animateMotion
          path="M120,30 C140,60 120,90 95,118"
          dur="2.6s"
          repeatCount="indefinite"
          keyPoints="0;1;1"
          keyTimes="0;0.7;1"
          calcMode="linear"
        />
      </g>
      <circle className="feat-upload-ring-track" cx="270" cy="60" r="26" />
      <circle className="feat-upload-ring-progress" cx="270" cy="60" r="26" />
      <path className="feat-upload-check" d="M258,60 l8,8 l18,-18" />
    </svg>
  );
}
