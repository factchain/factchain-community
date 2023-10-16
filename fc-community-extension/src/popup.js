import { render } from "solid-js/web";
import { createFactCheckProvider } from "./web3";
import { Popup } from "./components";

const provider = createFactCheckProvider();

render(() => <Popup provider={provider} />, document.getElementById("app"));
