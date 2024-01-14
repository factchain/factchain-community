import { createResource, Switch, Match } from 'solid-js';

import NotesIcon from '@/icons/NotesIcon';
import { getNotes } from '@/utils/backend';
import { FCLoader } from '@/pages/components';
import { cutText } from '@/utils/constants';

function FCNotes(props) {
  const [notes, { refetch }] = createResource(props.queryparams, () =>
    getNotes(props.queryparams)
  );

  return (
    <Switch>
      <Match when={notes.error}>
        <ErrorBox error={notes.error} onRetry={refetch} />
      </Match>
      <Match when={notes.loading}>
        <div className="flex justify-center items-center h-full">
          <FCLoader />
        </div>
      </Match>
      <Match when={true}>
        {notes.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <EmptyState />
          </div>
        ) : (
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
        )}
      </Match>
    </Switch>
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

const ErrorBox = (props) => {
  return (
    <div className="flex justify-center items-center h-full flex-col space-y-4">
      <div className="bg-red-400 border border-red-900 p-4 rounded">
        <div>Error: {props.error.message}</div>
      </div>

      <button className="btn" onclick={props.onRetry}>
        Retry
      </button>
    </div>
  );
};
