import { render } from "solid-js/web";
import { createSignal, createEffect, Switch, Match, createResource } from "solid-js";
import { createFactchainProvider } from "../utils/web3";
import { FCHero, FCLoader } from "./components";
import { getNotes } from "../utils/backend";


const cutText = (text, maxLength) => {
    return text.length < maxLength ? text : `${text.slice(0, maxLength)}...`;
}

function FCProfile({ provider }) {
    const [address, setAddress] = createSignal(null);
    const changeConnectionState = async () => {
        if (address()) {
            await provider.disconnect();
        } else {
            await provider.getAddress(true).then(setAddress);
        }
    }
    provider.getAddress(false).then(setAddress);
    provider.onAddressChange(setAddress);
    return (
        <div style="height: 75%; overflow:auto;">
            <div>
                <div
                    style="padding: 10px; font-size: 200%; font-weight: bold; width: 100%; position: relative; left: 50%; transform: translateX(-50%); text-align: center;"
                >
                    Account
                </div>
                <div
                    style="font-size: 110%; width: 100%; position: relative; left: 50%; transform: translateX(-50%); text-align: center;"
                >
                    {address() || "0x?"}
                </div>
                <button
                    style="padding: 8px; font-size: 140%; font-weight: bold; width: 100%; position: relative; left: 50%; transform: translateX(-50%);"
                    onclick={changeConnectionState}
                >
                    {address() ? "Log out" : "Connect a wallet"}
                </button>
            </div>
        </div>
    );
}

function FCNotes() {
    const [notes, { reload }] = createResource(() => getNotes());

    createEffect(async () => {
        try {
            await reload();
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    });

    function FCNote({ postUrl, content, creator }) {
        return (
            <div key={postUrl} style="margin: 10px; background-color: #393E46; padding: 10px; border-radius: 10px;">
                <div><a href={postUrl} target="_blank">{cutText(postUrl, 35)}</a></div>
                <div>{cutText(content, 115)}</div>
                <div style="display: flex; justify-content: flex-end; font-style: italic;">-- {creator}</div>
            </div>
        );
    }

    return (
        <div style="height: 75%; overflow:auto;">
            <Switch>
                <Match when={notes() !== undefined}>
                    <For each={notes()}>{(note) =>
                        <FCNote key={note.postUrl} postUrl={note.postUrl} creator={note.creator} content={note.content} />
                    }</For>
                </Match>
                <Match when={true}>
                    <FCLoader />
                </Match>
            </Switch>
        </div>
    );
}

function FCVotes() {
    return (
        <div style="height: 75%; overflow:auto;">
            Votes
        </div>
    );
}

function FCFooter(props) {
    props.setSelectedTab("Notes");
    return (
        <div style="margin-top: 15px; display: flex; flex-direction: row; justify-content: space-between;">
            <FCFooterTab name="Profile" selectedTab={props.selectedTab} onClick={props.setSelectedTab} />
            <FCFooterTab name="Notes" selectedTab={props.selectedTab} onClick={props.setSelectedTab} />
            <FCFooterTab name="Votes" selectedTab={props.selectedTab} onClick={props.setSelectedTab} />
        </div>
    );
}

function FCFooterTab(props) {
    const selected = () => props.name === props.selectedTab;
    const backgroundColor = () => selected() ? "#222831" : "#00ADB5";
    const fontColor = () => selected() ? "#00ADB5" : "#222831";
    const fontWeight = () => selected() ? "900" : "normal";
    return (
        <div
            style={`background-color: ${backgroundColor()}; color: ${fontColor()}; font-weight: ${fontWeight()}; padding: 10px; flex-basis: 33%; text-align: center;`}
            onclick={() => props.onClick(props.name)}
        >
            {props.name}
        </div>
    );
}

function FCPopup({ provider }) {
    const [selectedTab, setSelectedTab] = createSignal("");
    return (
        <div style="height:580px; width: 350px;">
            <FCHero />
            <Switch>
                <Match when={selectedTab() === "Profile"}>
                    <FCProfile provider={provider} />
                </Match>
                <Match when={selectedTab() === "Notes"}>
                    <FCNotes />
                </Match>
                <Match when={selectedTab() === "Votes"}>
                    <FCVotes />
                </Match>
            </Switch>
            <FCFooter selectedTab={selectedTab()} setSelectedTab={setSelectedTab} />
        </div>
    );
}

const provider = await createFactchainProvider();

render(() => <FCPopup provider={provider} />, document.getElementById("app"));
