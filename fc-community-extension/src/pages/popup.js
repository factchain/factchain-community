import { render } from 'solid-js/web';
import { createSignal, Switch, Match, createResource } from 'solid-js';
import { createFactchainProvider } from '../utils/web3';
import { FCHero, FCLoader } from './components';
import { getNotes } from '../utils/backend';
import { ethers } from 'ethers';
import { cutText } from '../utils/constants';

function FCProfile(props) {
  function StatCard(props) {
    return (
      <div style="text-align: center;">
        <div style="font-size: 140%; font-weight: bold;">{props.value}</div>
        <div style="font-size: 110%;">{props.name}</div>
      </div>
    );
  }

  return (
    <div style="height: 75%; overflow:auto;">
      <div>
        <div style="margin-top: 20px; padding: 10px; font-size: 200%; font-weight: bold; width: 100%; position: relative; left: 50%; transform: translateX(-50%); text-align: center;">
          Account
        </div>
        <div style="font-size: 110%; width: 100%; position: relative; left: 50%; transform: translateX(-50%); text-align: center;">
          {props.loggedIn ? props.address : '0x?'}
        </div>
        <div style="margin-top: 40px; margin: 30px; display: flex; flex-direction: row; justify-content: space-between;">
          <StatCard name="Notes" value={props.numberNotes} />
          <StatCard name="Ratings" value={props.numberRatings} />
          <StatCard name="Earnings" value={props.earnings} />
        </div>
        <button
          style="margin-top: 10px; padding: 8px; font-size: 140%; font-weight: bold; width: 100%; position: relative; left: 50%; transform: translateX(-50%);"
          onclick={props.changeConnectionState}
        >
          {props.loggedIn ? 'Log out' : 'Connect a wallet'}
        </button>
      </div>
    </div>
  );
}

function FCNotes(props) {
  const [notes] = createResource(() => getNotes(props.queryparams));

  function FCNote({ postUrl, content, creator }) {
    return (
      <div
        key={postUrl}
        style="margin: 10px; background-color: #393E46; padding: 10px; border-radius: 10px;"
      >
        <div>
          <a href={postUrl} target="_blank">
            {cutText(postUrl, 35)}
          </a>
        </div>
        <div>{cutText(content, 115)}</div>
        <div style="display: flex; justify-content: flex-end; font-style: italic;">
          -- {creator}
        </div>
      </div>
    );
  }

  return (
    <div style="height: 75%; overflow:auto;">
      <Switch>
        <Match when={!props.loggedIn}>
          <div style="font-size: 150%; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
            <div class="link" onclick={props.connectWallet}>
              Connect a wallet
            </div>
            <div>to view Factchain notes</div>
          </div>
        </Match>
        <Match when={notes() !== undefined}>
          <For each={notes()}>
            {(note) => (
              <FCNote
                key={note.postUrl}
                postUrl={note.postUrl}
                creator={note.creatorAddress}
                content={note.content}
              />
            )}
          </For>
        </Match>
        <Match when={true}>
          <div style="position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
            <FCLoader />
          </div>
        </Match>
      </Switch>
    </div>
  );
}

function FCFooter(props) {
  function FCFooterTab(props) {
    const selected = () => props.name === props.selectedTab;
    const classes = () => `tab ${selected() ? 'selected' : ''}`;
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
      <FCFooterTab
        name="Profile"
        selectedTab={props.selectedTab}
        onClick={props.setSelectedTab}
      />
      <FCFooterTab
        name="Notes"
        selectedTab={props.selectedTab}
        onClick={props.setSelectedTab}
      />
      <FCFooterTab
        name="Ratings"
        selectedTab={props.selectedTab}
        onClick={props.setSelectedTab}
      />
    </div>
  );
}

function FCPopup({ provider }) {
  const [selectedTab, setSelectedTab] = createSignal('Profile');
  const [address, setAddress] = createSignal('');
  const loggedIn = () => !!address();

  const changeConnectionState = async () => {
    if (loggedIn()) {
      await provider.disconnect();
      setAddress('');
    } else {
      await provider.requestAddress().then(setAddress);
    }
  };
  const connectWallet = async () => {
    setSelectedTab('Profile');
    await provider.requestAddress().then(setAddress);
  };
  const getUserStats = async (address) => {
    console.log(`address: ${address}`);
    if (address) {
      const contract = await provider.getFCContract();
      const stats = await contract.userStats(address);
      console.log(`User stats: ${stats}`);
      const earnings = `${Math.max(Number(stats[2] - stats[3]), 0)}`;
      return {
        notes: `${stats[0]}`,
        ratings: `${stats[1]}`,
        earnings: `${ethers.formatEther(earnings)} ETH`,
      };
    } else {
      console.log(`Default data for user stats`);
      return {
        notes: '?',
        ratings: '?',
        earnings: '? ETH',
      };
    }
  };
  const [userStats] = createResource(address, getUserStats);
  const numberNotes = () =>
    userStats.ready || !userStats() ? '?' : userStats().notes;
  const numberRatings = () =>
    userStats.loading || !userStats() ? '?' : userStats().ratings;
  const earnings = () =>
    userStats.loading || !userStats() ? '? ETH' : userStats().earnings;
  provider.getAddress().then(setAddress);

  return (
    <div style="height:575px; width: 340px;">
      <FCHero />
      <Switch>
        <Match when={selectedTab() === 'Profile'}>
          <FCProfile
            provider={provider}
            loggedIn={loggedIn()}
            address={address()}
            changeConnectionState={changeConnectionState}
            numberNotes={numberNotes()}
            numberRatings={numberRatings()}
            earnings={earnings()}
          />
        </Match>
        <Match when={selectedTab() === 'Notes'}>
          <FCNotes
            loggedIn={loggedIn()}
            queryparams={{ creatorAddress: address() }}
            connectWallet={connectWallet}
          />
        </Match>
        <Match when={selectedTab() === 'Ratings'}>
          <FCNotes
            loggedIn={loggedIn()}
            queryparams={{ awaitingRatingBy: address() }}
            connectWallet={connectWallet}
          />
        </Match>
      </Switch>
      <FCFooter selectedTab={selectedTab()} setSelectedTab={setSelectedTab} />
    </div>
  );
}

const provider = await createFactchainProvider();

render(() => <FCPopup provider={provider} />, document.getElementById('app'));
