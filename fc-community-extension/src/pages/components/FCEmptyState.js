const IconNotebook = ({ size, ...p }) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height={size}
      width={size}
      {...p}
    >
      <path d="M4.98 4a.5.5 0 00-.39.188L1.54 8H6a.5.5 0 01.5.5 1.5 1.5 0 103 0A.5.5 0 0110 8h4.46l-3.05-3.812A.5.5 0 0011.02 4H4.98zm9.954 5H10.45a2.5 2.5 0 01-4.9 0H1.066l.32 2.562a.5.5 0 00.497.438h12.234a.5.5 0 00.496-.438L14.933 9zM3.809 3.563A1.5 1.5 0 014.981 3h6.038a1.5 1.5 0 011.172.563l3.7 4.625a.5.5 0 01.105.374l-.39 3.124A1.5 1.5 0 0114.117 13H1.883a1.5 1.5 0 01-1.489-1.314l-.39-3.124a.5.5 0 01.106-.374l3.7-4.625z" />
    </svg>
  );
};

const FCEmptyState = ({ text }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col gap-4 rounded-2xl bg-neutral-950/30 items-center p-8">
        <IconNotebook className="opacity-10" size={64} />
        <div className="text-sm opacity-60">{text}</div>
      </div>
    </div>
  );
};

export default FCEmptyState;
