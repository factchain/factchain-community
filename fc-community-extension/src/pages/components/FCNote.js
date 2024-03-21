import { elipseText } from '../../utils/constants';

const FCNote = (props) => {
  // assuming `postUrl` looks like: https://x.com/foo/status/<id>
  const postId = props.postUrl.split('/').slice(-1)[0];

  return (
    <a
      href={props.postUrl}
      target="_blank"
      rel="noreferrer noopener"
      className="bg-fcGrey/70 rounded-md p-2 text-xs space-y-2 shadow block hover:bg-fcGrey/90"
    >
      <div className="flex items-center gap-2">
        <img
          src={`/logos/${props.socialName}.png`}
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
    </a>
  );
};

export default FCNote;
