export default function BuildingLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className="w-8 h-8"
    >
      {/* Main building shapes */}
      <path
        d="M6 28V12L16 4L26 12V28H6Z"
        fill="#4F46E5"
        stroke="#6366F1"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Windows */}
      <rect x="10" y="14" width="4" height="4" fill="#C7D2FE" rx="1" />
      <rect x="18" y="14" width="4" height="4" fill="#C7D2FE" rx="1" />
      <rect x="10" y="20" width="4" height="4" fill="#C7D2FE" rx="1" />
      <rect x="18" y="20" width="4" height="4" fill="#C7D2FE" rx="1" />

      {/* Door */}
      <rect x="14" y="22" width="4" height="6" fill="#818CF8" rx="1" />

      {/* Roof accent */}
      <path
        d="M16 4L19 6.5L16 9L13 6.5L16 4Z"
        fill="#818CF8"
        stroke="#6366F1"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
