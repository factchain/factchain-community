import { elipseText } from '../../utils/constants';

const FCNote = (props) => {
  // assuming `postUrl` looks like: https://x.com/foo/status/<id>
  const splittedUrl = props.postUrl.split('/');
  const postId = splittedUrl.slice(-1)[0];
  const host = splittedUrl[2];

  // extension only support these two socials
  const social = host.startsWith('warpcast') ? 'warpcast' : 'x';

  const noteClicked = async () => {
    if (social !== 'x') {
      await chrome.runtime.sendMessage({
        type: props.finalRating ? 'fc-mint-factchain-note' : 'fc-rate-note',
        note: {
          postUrl: props.postUrl,
          creatorAddress: props.creator,
          content: props.content,
        },
        socialName: social,
      });
    }
    window.open(props.postUrl, '_blank');
  };

  return (
    <div
      onClick={noteClicked}
      href={props.postUrl}
      className="bg-fcGrey/70 rounded-md p-2 text-xs space-y-2 shadow block hover:bg-fcGrey/90 hover:cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <img
          src={`/logos/${social}.png`}
          className="rounded-full w-[24px] h-[24px] object-cover shadow"
        />
        <div className="truncate">
          <strong>{elipseText(props.creator, 10)}</strong>
          <span className="opacity-70">{' - '}</span>
          <span className="italic">{postId}</span>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <div className="opacity-90 line-clamp-4 flex-grow">{props.content}</div>
        {!props.hideMetas && props.finalRating && (
          <div className="shrink-0 flex flex-col gap-1 items-center">
            <img
              src="/icons/icon_32.png"
              className="rounded-full w-[32px] h-[32px] object-cover shadow"
            />
            <div className="flex items-center gap-1">
              {/* TODO proper note + dynamic image based on note */}
              <strong>{props.finalRating}</strong>
              <span>
                <img
                  className="w-[16px] h-[16px]"
                  alt="star-awesome"
                  src="/ui/icons/star-awesome.png"
                />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FCNote;
