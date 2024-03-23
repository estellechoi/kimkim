import Image from 'next/image';

type NFTSize = 'md';

const SIZE_CLASS_DICT: Record<NFTSize, { className: string; pxSize: number }> = {
  md: {
    className: 'w-20 h-20',
    pxSize: 80,
  },
};

type NFTProps = {
  thumbnailURL?: string;
  mediaFormat?: string;
  name?: string;
  size?: NFTSize;
  caption?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const NFT = ({ thumbnailURL, mediaFormat, name = 'NFT', size = 'md', caption, onMouseEnter, onMouseLeave }: NFTProps) => {
  const imgSize = SIZE_CLASS_DICT[size];

  return (
    <div
      className="space-y-2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseOut={onMouseLeave}
      onMouseOver={onMouseEnter}
    >
      <div
        className={`group/nft bg-primary border-2 border-white rounded-card_md overflow-hidden ${imgSize.className} ${
          thumbnailURL ? '' : 'animate-pulse'
        }`}
      >
        {thumbnailURL && (
          <Image
            src={thumbnailURL}
            alt={name}
            width={imgSize.pxSize}
            height={imgSize.pxSize}
            className="object-cover Transition_500 transition-transform group-hover/nft:scale-105"
          />
        )}
      </div>

      {caption && <span className="Font_caption_xs text-white truncate">{caption}</span>}
    </div>
  );
};

export default NFT;
