export function FCLoader() {
  return (
    <span class="loader" style="width: 30px; height: 30px; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);"></span>
  );
}

export function FCHero() {
  return (
    <img
        src="./factchain.jpeg"
        width="300"
        style="position: relative; left: 50%; transform: translateX(-50%); height:70px; object-fit:cover;"
    ></img>
  );
}
