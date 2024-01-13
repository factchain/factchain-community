import { render } from 'solid-js/web';
import {
  createSignal,
  Switch,
  Match,
  createResource,
  createEffect,
} from 'solid-js';
import { createFactchainProvider } from '../utils/web3';
import { FCHero, FCLoader } from './components';
import { getNotes } from '../utils/backend';
import { ethers } from 'ethers';
import { cutText } from '../utils/constants';
import ProfileIcon from '../icons/ProfileIcon';
import RatingsIcon from '../icons/RatingsIcon';
import NotesIcon from '../icons/NotesIcon';

import '../style.css';

function FCProfile(props) {
  function StatCard(props) {
    return (
      <div className="p-4 py-6 w-[120px] flex flex-col items-center border-r-2 border-gray-800 border-opacity-20 space-y-1 last:border-none">
        <div className="font-bold text-lg">{props.value}</div>
        <div className="text-neutral-300">{props.name}</div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-8">
      <div className="flex flex-col items-center space-y-2">
        <div className="text-xl font-bold text-center">Account</div>
        <div className="text-neutral-400">
          {props.loggedIn ? props.address : '0x?'}
        </div>
      </div>
      <div className="flex items-center justify-between bg-gray-700 rounded-3xl">
        <StatCard name="Notes" value={props.numberNotes} />
        <StatCard name="Ratings" value={props.numberRatings} />
        <StatCard name="Earnings" value={props.earnings} />
      </div>
      <button className="btn" onclick={props.changeConnectionState}>
        {props.loggedIn ? 'Log out' : 'Connect a wallet to start'}
      </button>
    </div>
  );
}

function FCNotes(props) {
  const [notes, { refetch }] = createResource(() =>
    getNotes(props.queryparams)
  );

  function FCNote({ postUrl, content, creator }) {
    const openNote = () => {
      window.open(postUrl);
    };
    return (
      <div
        onclick={openNote}
        key={postUrl}
        className="flex flex-col bg-gray-700 rounded-md p-2 shadow border border-gray-600 space-y-4 cursor-pointer hover:bg-gray-800 colors-animation"
      >
        <div className="text-lg">{cutText(content, 200)}</div>
        <div className="text-3xs uppercase text-neutral-400 text-right">
          {creator}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Switch>
        <Match when={!props.loggedIn}>
          <div>
            <button class="btn" onclick={props.connectWallet}>
              Connect a wallet
            </button>
            <div>test</div>
            <div>to view Factchain notes</div>
          </div>
        </Match>
        <Match when={!notes.loading && !!notes() && notes().length > 0}>
          <div className="space-y-4">
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
          </div>
        </Match>
        <Match when={notes.loading}>
          <div className="flex justify-center items-center h-full">
            <FCLoader />
          </div>
        </Match>
        <Match when={!!notes().error}>
          <div className="flex justify-center items-center h-full flex-col space-y-4">
            <div>Error occured</div>
            <button className="btn" onclick={() => refetch()}>
              Retry
            </button>
          </div>
        </Match>
        <Match when={true}>
          <div className="flex justify-center items-center h-full">
            <EmptyState />
          </div>
        </Match>
      </Switch>
    </div>
  );
}

// TODO nicer empty state
const EmptyState = () => {
  return (
    <div className="flex items-center flex-col space-y-2 p-4">
      <div className="text-gray-600">
        <NotesIcon size={24} />
      </div>
      <div className="text-lg font-bold text-gray-300">No data</div>
    </div>
  );
};

function FCFooter(props) {
  function FCFooterTab(props) {
    const { name, Icon, isSelected, onClick } = props;
    const borderClass =
      'border-r-2 border-gray-800 border-opacity-20  last:border-none';

    const getContainerClasses = () => [
      'group',
      'flex flex-1 justify-center py-2',
      'text-white',
      'border-r-2 border-gray-800 border-opacity-20  last:border-none',
      props.isDisabled()
        ? 'pointer-events-none cursor-not-allowed opacity-20'
        : 'cursor-pointer',
      isSelected() ? 'bg-gray-800 bg-opacity-20' : '',
      'hover:bg-gray-800 hover:bg-opacity-20',
      'colors-animation',
      'border-r-2 border-gray-000 border-opacity-20  last:border-none',
    ];

    const getClasses = () => [
      'w-[48px] h-[48px] flex items-center justify-center',
      'colors-animation',
      'rounded-[50%]',
      isSelected() ? 'bg-cyan-600' : 'group-hover:bg-cyan-600',
    ];

    return (
      <div
        className={getContainerClasses().join(' ')}
        onclick={onClick}
        title={name}
      >
        <div className={getClasses().join(' ')}>
          <Icon size={16} />
        </div>
      </div>
    );
  }
  const { setSelectedTab } = props;

  return (
    <div className="flex bg-gray-700">
      <FCFooterTab
        name="Profile"
        Icon={ProfileIcon}
        isSelected={() => props.selectedTab() === 'Profile'}
        isDisabled={() => false}
        onClick={() => setSelectedTab('Profile')}
      />
      <FCFooterTab
        Icon={NotesIcon}
        isDisabled={() => !props.isLoggedIn()}
        isSelected={() => props.selectedTab() === 'Notes'}
        name="Notes"
        onClick={() => setSelectedTab('Notes')}
      />
      <FCFooterTab
        Icon={RatingsIcon}
        isDisabled={() => !props.isLoggedIn()}
        isSelected={() => props.selectedTab() === 'Ratings'}
        name="Ratings"
        onClick={() => setSelectedTab('Ratings')}
      />
    </div>
  );
}

function FCPopup({ provider }) {
  const [selectedTab, setSelectedTab] = createSignal('Profile');
  const [address, setAddress] = createSignal('');

  const checkIfLoggedIn = () => {
    const hasAddress = !!address();
    return hasAddress;
  };

  const changeConnectionState = async () => {
    if (checkIfLoggedIn()) {
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
    <div className="bg-gray-900 bg-opacity-[2%] w-[400px] h-[600px] flex flex-col">
      <div>
        <FCHero />
      </div>
      <div className="p-2 grow">
        <Switch>
          <Match when={selectedTab() === 'Profile'}>
            <FCProfile
              provider={provider}
              loggedIn={checkIfLoggedIn()}
              address={address()}
              changeConnectionState={changeConnectionState}
              numberNotes={numberNotes()}
              numberRatings={numberRatings()}
              earnings={earnings()}
            />
          </Match>
          <Match when={selectedTab() === 'Notes'}>
            <FCNotes
              loggedIn={checkIfLoggedIn()}
              queryparams={{ creatorAddress: address() }}
              connectWallet={connectWallet}
            />
          </Match>
          <Match when={selectedTab() === 'Ratings'}>
            <FCNotes
              loggedIn={checkIfLoggedIn()}
              queryparams={{ awaitingRatingBy: address() }}
              connectWallet={connectWallet}
            />
          </Match>
        </Switch>
      </div>

      <FCFooter
        isLoggedIn={address}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </div>
  );
}

const provider = await createFactchainProvider();

render(() => <FCPopup provider={provider} />, document.getElementById('app'));
