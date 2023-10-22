import Image from 'next/image';

import profileDummy from '@/public/profile_pic_dummy.png';

interface ProfilePicI {
  data: {
    avatar_url: string | null;
    login: string | null;
    name: string | null;
  };
}

export default function ProfilePic({ data }: ProfilePicI): JSX.Element {
  const { avatar_url, login, name } = data;
  return (
    <div className="flex sm:flex-col items-center flex-row gap-[20px]">
      <div className="sm:max-w-[160px] max-w-[88px] h-[88px] sm:h-[160px] w-full rounded-full object-cover overflow-hidden">
        {avatar_url && (
          <Image
            className="w-full"
            src={avatar_url ? avatar_url : profileDummy}
            alt="dummy"
            width={88}
            height={88}
            loader={() => avatar_url as string}
          />
        )}

        {!avatar_url && (
          <Image className="w-full" src={profileDummy} alt="dummy" />
        )}
      </div>
      <div className="sm:text-center w-full ">
        <p className="text-[24px] font-[700] text-[#101828]">
          {name ? name : '-'}
        </p>
        <p className="text-[16px] font-[400] text-[#344054]">
          @{login ? login : '-'}
        </p>
      </div>
    </div>
  );
}
