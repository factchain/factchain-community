export function FCLoader() {
  return (
    <span
      class="loader"
      style="width: 30px; height: 30px; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);"
    ></span>
  );
}

// don't want to break existing stuff, adding a new Loader component
export function FCLoaderClean() {
  return <span className="loader w-[30px] h-[30px]" />;
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
    <div className="py-4 text-center relative select-none">
      <div className="text-2xl text-fcAccent font-semibold">{title}</div>
      <div class="absolute inset-y-0 right-0 flex items-center justify-center pr-4">
        <button
          className="text-fcAccent opacity-50"
          disabled
          title="Coming soon!"
        >
          <img src="/ui/icons/menu.png" />
        </button>
      </div>
    </div>
  );
}
