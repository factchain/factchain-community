import { createResource } from 'solid-js';

import NotesIcon from '@/icons/NotesIcon';
import { getNotes } from '@/utils/backend';
import { FCLoader } from '@/pages/components';
import { cutText } from '@/utils/constants';

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
          <div className="space-y-4 overflow-y-auto max-h-[450px]">
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

export default FCNotes;
