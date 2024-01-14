import { elipseText } from '@/utils/constants';

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
          {props.loggedIn ? elipseText(props.address, 20) : '0x?'}
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

export default FCProfile;
