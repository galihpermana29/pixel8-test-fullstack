import profileDummy from '@/public/profile_pic_dummy.png';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { LoginDataResponseI } from 'utils/interfaces';

interface UserDataI {
  data: LoginDataResponseI;
}

export default function LatestVisitors({ data }: UserDataI): JSX.Element {
  const { latest_visitors = [] } = data ?? { latest_visitors: [] };
  const router = useRouter();
  return (
    <div className="mt-[40px]">
      <div>
        <p className="text-[14px] font-[700] text-[#344054]">Latest Visitor</p>
      </div>
      {data &&
        data.latest_visitors &&
        latest_visitors.map((dt, idx) => (
          <div
            onClick={() => router.push(`/${dt.username}`)}
            className="cursor-pointer sm:max-w-[56px] max-w-[40px] w-full rounded-full object-cover mt-[10px] overflow-hidden"
            key={idx}>
            <Image
              className="w-full"
              src={dt.avatar_url ? dt.avatar_url : profileDummy}
              alt="dummy"
              width={88}
              height={88}
              loader={() => dt.avatar_url as string}
            />
          </div>
        ))}

      {!data && '-'}
    </div>
  );
}
