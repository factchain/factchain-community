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
        <div className="shrink-0 w-[24px] h-[24px] rounded-full bg-pink-400/30"></div>
        <div className="truncate">
          <strong>{elipseText(props.creator, 10)}</strong>
          <span className="opacity-70">{' - '}</span>
          <span className="italic">{postId}</span>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <div className="opacity-90 line-clamp-4 flex-grow">{props.content}</div>
        {!props.hideMetas && (
          <div className="shrink-0 flex flex-col gap-1 items-center">
            <div className="w-[32px] h-[32px] bg-pink-400/30 rounded"></div>
            <div className="flex items-center gap-1">
              {/* TODO proper note + dynamic image based on note */}
              <strong>{'4.9'}</strong>
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
