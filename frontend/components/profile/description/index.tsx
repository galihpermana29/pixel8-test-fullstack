import Image from 'next/image';

import emailPic from '@/public/email.png';
import visitor from '@/public/visitor.png';

interface ProfilePicI {
  data: {
    bio: string | null;
    email: string | null;
    visitor_counter: number | null;
  };
}

export default function DescriptionProfile({ data }: ProfilePicI): JSX.Element {
  const { bio, email, visitor_counter } = data;

  return (
    <div className="flex flex-col items-center w-full mt-[24px]">
      <div className="w-full">
        <p className="text-[14px] font-[700] text-[#344054]">About</p>
        <p className="text-[16px] font-[400] text-[#344054] mt-[10px]">
          {bio ? bio : '-'}
        </p>
      </div>
      <div className="w-full mt-[16px]">
        <div className="flex items-center gap-[5px]">
          <div>
            <Image src={emailPic} alt="email" />
          </div>
          <p className="text-[16px] font-[400] text-[#344054]">
            {email ? email : '-'}
          </p>
        </div>
        <div className="flex items-center gap-[5px] mt-[8px]">
          <div>
            <Image src={visitor} alt="email" />
          </div>
          <p className="text-[16px] font-[400] text-[#344054]">
            <span className="text-[16px] font-[700] text-[#1D2939] mr-[5px]">
              {visitor_counter ? visitor_counter : '0'}
            </span>
            profile visitor
          </p>
        </div>
      </div>
    </div>
  );
}
