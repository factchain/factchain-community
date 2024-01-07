import { render } from "solid-js/web";
import { createSignal, createEffect, Switch, Match, createResource } from "solid-js";
import { createFactchainProvider } from "../utils/web3";
import { FCHero, FCLoader } from "./components";
import { getNotes } from "../utils/backend";


const cutText = (text, maxLength) => {
    return text.length < maxLength ? text : `${text.slice(0, maxLength)}...`;
}

function FCProfile({ provider }) {

    function StatCard({ name, value }) {
        return (
            <div style="text-align: center;">
                <div style="font-size: 140%; font-weight: bold;">{value}</div>
                <div style="font-size: 110%;">{name}</div>
            </div>
        );
    }

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
                    style="margin-top: 20px; padding: 10px; font-size: 200%; font-weight: bold; width: 100%; position: relative; left: 50%; transform: translateX(-50%); text-align: center;"
                >
                    Account
                </div>
                <div
                    style="font-size: 110%; width: 100%; position: relative; left: 50%; transform: translateX(-50%); text-align: center;"
                >
                    {address() || "0x?"}
                </div>
                <div style="margin-top: 40px; margin: 30px; display: flex; flex-direction: row; justify-content: space-between;">
                    <StatCard name="Notes" value="?" />
                    <StatCard name="Ratings" value="?" />
                    <StatCard name="Earnings" value="? ETH" />
                </div>
                <button
                    style="margin-top: 10px; padding: 8px; font-size: 140%; font-weight: bold; width: 100%; position: relative; left: 50%; transform: translateX(-50%);"
                    onclick={changeConnectionState}
                >
                    {address() ? "Log out" : "Connect a wallet"}
                </button>
            </div>
        </div>
    );
}

function FCNotes({ queryparams }) {
    const [notes, { reload }] = createResource(() => getNotes(queryparams));

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

function FCFooter(props) {
    function FCFooterTab(props) {
        const selected = () => props.name === props.selectedTab;
        const classes = () => `tab ${selected() ? "selected" : ""}`;
        const imgSrc = `./${props.name.toLowerCase()}.svg`;
        return (
            <div
                class={classes()}
                onclick={() => props.onClick(props.name)}
                title={props.name}
                style="margin: 0 20px 0 20px"
            >
                <img
                    src={imgSrc}
                    alt={props.name}
                    style="width: 18px; height:18px; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);"
                ></img>
            </div>
        );
    }
    return (
        <div style="width: 100%; margin-top: 15px; padding: 10px; display: flex; flex-direction: row; justify-content: space-between; background-color: #393e46; position: relative; left: 50%; transform: translateX(-50%);">
            <FCFooterTab name="Profile" selectedTab={props.selectedTab} onClick={props.setSelectedTab} />
            <FCFooterTab name="Notes" selectedTab={props.selectedTab} onClick={props.setSelectedTab} />
            <FCFooterTab name="Ratings" selectedTab={props.selectedTab} onClick={props.setSelectedTab} />
        </div>
    );
}

function FCPopup({ provider }) {
    const [selectedTab, setSelectedTab] = createSignal("Profile");
    const [address, setAddress] = createSignal(null);
    provider.getAddress().then(setAddress);

    return (
        <div style="height:575px; width: 350px;">
            <FCHero />
            <Switch>
                <Match when={selectedTab() === "Profile"}>
                    <FCProfile provider={provider} />
                </Match>
                <Match when={selectedTab() === "Notes"}>
                    <FCNotes queryparams={{creatorAddress: address()}}/>
                </Match>
                <Match when={selectedTab() === "Ratings"}>
                    <FCNotes queryparams={{awaitingRatingBy: address()}} />
                </Match>
            </Switch>
            <FCFooter selectedTab={selectedTab()} setSelectedTab={setSelectedTab} />
        </div>
    );
}

const provider = await createFactchainProvider();

render(() => <FCPopup provider={provider} />, document.getElementById("app"));
