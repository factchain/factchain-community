export function FCLoader() {
  return (
    <span
      class="loader"
      style="width: 30px; height: 30px; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);"
    ></span>
  );
}

export function FCHero() {
  return (
    <div className="flex justify-center items-center py-2 h-[105px]">
      <img className="w-[200px] h-auto" src="./factchain-cropped.jpeg"></img>
    </div>
  );
}

export function FCContainer({ children }) {
  return (
    <div className="flex-grow relative">
      <div className="absolute inset-0 overflow-y-scroll p-4">{children}</div>
    </div>
  );
}

export function FCHeader({ title }) {
  return (
    <div className="py-4 text-center relative">
      <div className="text-2xl text-fcAccent font-semibold">{title}</div>
      <div class="absolute inset-y-0 right-0 flex items-center justify-center pr-4">
        <button className="text-fcAccent">
          <SettingsIcon size={24} />
        </button>
      </div>
    </div>
  );
}

// yeah baptiste i know it's not the same icon
// as in the design but i'm out of time lol
export function SettingsIcon({ size = 16 }) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      height={size}
      width={size}
    >
      <path d="M20 7h-9M14 17H5" />
      <path d="M20 17 A3 3 0 0 1 17 20 A3 3 0 0 1 14 17 A3 3 0 0 1 20 17 z" />
      <path d="M10 7 A3 3 0 0 1 7 10 A3 3 0 0 1 4 7 A3 3 0 0 1 10 7 z" />
    </svg>
  );
}
