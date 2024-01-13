export function FCLoader() {
  return (
    <div className="border border-4 border-neutral-700 border-b-cyan-300 h-[30px] w-[30px] rounded-[50%] animate-spin" />
  );
}

// Get SVG of logo
export function FCHero() {
  return (
    <img
      src="./factchain.jpeg"
      width="300"
      style="position: relative; left: 50%; transform: translateX(-50%); height:70px; object-fit:cover;"
    ></img>
  );
}
