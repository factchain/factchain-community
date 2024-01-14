import { ethers } from 'ethers';
import { render } from 'solid-js/web';
import { createSignal, Switch, Match, createResource } from 'solid-js';

import '@/style.css';
import { createFactchainProvider } from '@/utils/web3';
import { FCHero } from '@/pages/components';
import { cutText } from '@/utils/constants';

import Profile from './Profile';
import Notes from './Notes';
import Footer from './Footer';

function FCPopup({ provider }) {
  const [selectedTab, setSelectedTab] = createSignal('Profile');
  const [address, setAddress] = createSignal('');

  const checkIfLoggedIn = () => {
    const hasAddress = !!address();
    return hasAddress;
  };

  const changeConnectionState = async () => {
    setSelectedTab('Profile');
    if (checkIfLoggedIn()) {
      await provider.disconnect();
      await chrome.runtime.sendMessage({
        type: 'fc-set-address',
        address: '',
      });
      setAddress('');
    } else {
      await provider.requestAddress().then(setAddress);
    }
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

  // TODO find logo in svg
  return (
    <div className="bg-[#222831] w-[400px] h-[600px] flex flex-col">
      <div>
        <FCHero />
      </div>
      <div className="p-2 grow">
        <Switch>
          <Match when={selectedTab() === 'Profile'}>
            <Profile
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
            <Notes
              loggedIn={checkIfLoggedIn()}
              queryparams={{ creatorAddress: address() }}
              connectWallet={changeConnectionState}
            />
          </Match>
          <Match when={selectedTab() === 'Ratings'}>
            <Notes
              loggedIn={checkIfLoggedIn()}
              queryparams={{ awaitingRatingBy: address() }}
              connectWallet={changeConnectionState}
            />
          </Match>
        </Switch>
      </div>
      <Footer
        isLoggedIn={address}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </div>
  );
}

const provider = await createFactchainProvider();

render(() => <FCPopup provider={provider} />, document.getElementById('app'));
