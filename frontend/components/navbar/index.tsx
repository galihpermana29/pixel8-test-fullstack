import Image from 'next/image';

import logo from '@/public/logo.png';
import hamburger from '@/public/hamburger.png';
import cross from '@/public/cross.png';
import { useEffect, useState } from 'react';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';

import profileDummy from '@/public/profile_pic_dummy.png';
import GithubAPI from 'api/github';
import { extractGitHubUserId } from 'utils/utility';
import Link from 'next/link';

export default function Navigation(): JSX.Element {
  const [open, setIsOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const { data: session } = useSession();

  const getUserAfterLogIn = async () => {
    try {
      const username = extractGitHubUserId(session?.user?.image as string);
      const data = await GithubAPI.getUserAfterLoggedIn(username as string);
      localStorage.setItem('user', data.login);
      setUsername(data.login);
    } catch (error) {
      console.log(error, 'error');
    }
  };

  useEffect(() => {
    if (session) {
      getUserAfterLogIn();
    }
  }, [session]);

  return (
    <div className="flex justify-between items-center py-[10px] sm:py-[15px] px-[30px] sm:px-[50px] md:px-[112px]  bg-white relative shadow-sm">
      <div className="sm:max-w-[180px] max-w-[170px]">
        <Image src={logo} alt="logo" />
      </div>
      {session && session.user && (
        <div className="flex items-center gap-[16px]">
          <div className="sm:max-w-[40px] max-w-[40px] h-[40px] sm:h-[40px] w-full rounded-full object-cover overflow-hidden">
            {session?.user.image && (
              <Image
                className="w-full"
                src={session?.user.image ? session?.user.image : profileDummy}
                alt="dummy"
                width={88}
                height={88}
                loader={() => session?.user?.image as string}
              />
            )}
          </div>
          <div
            className="max-w-[25px] cursor-pointer"
            onClick={() => setIsOpen(!open)}>
            <Image src={open ? cross : hamburger} alt="hamburger" />
          </div>
        </div>
      )}

      <div
        className={`${
          open
            ? 'sm:shadow-md rounded-xl sm:max-h-max sm:min-h-0 absolute left-0 right-0 bg-white min-h-screen top-[100%] px-[20px] sm:px-[10px] sm:py-[10px] sm:absolute sm:left-[70%] sm:right-[10%]'
            : 'hidden'
        }`}>
        {session && (
          <>
            <div className="flex items-center flex-row gap-[20px] p-[12px] sm:p-[16px] sm:justify-center">
              <div className="w-[100px] min-w-[60px] sm:max-w-[60px] max-w-[60px] h-[60px] sm:h-[60px] border-2 rounded-full object-cover overflow-hidden ">
                {session?.user?.image && (
                  <Image
                    className="w-full"
                    src={
                      session?.user?.image ? session?.user?.image : profileDummy
                    }
                    alt="dummy"
                    width={88}
                    height={88}
                    loader={() => session?.user?.image as string}
                  />
                )}

                {!session?.user?.image && (
                  <Image className="w-full" src={profileDummy} alt="dummy" />
                )}
              </div>
              <div className="w-full ">
                <p className="text-[16px] font-[600] text-[#101828]">
                  {session?.user?.name ? session?.user?.name : '-'}
                </p>
                <p className="text-[14px] font-[400] text-[#344054]">
                  @{session?.user?.email ? session?.user?.email : '-'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-[20px] mt-[20px] sm:gap-2 sm:mt-2">
              <Link
                onClick={() => setIsOpen(false)}
                href={`/${username}`}
                className="text-[16px] font-[600] text-[#101828] p-[12px] sm:p-2">
                View Profile
              </Link>
              <p
                onClick={() => {
                  localStorage.clear();
                  signOut();
                }}
                className="text-[16px] font-[600] text-[#101828] p-[12px] sm:p-2 cursor-pointer">
                Logout
              </p>
            </div>
          </>
        )}

        {!session && (
          <button
            className={`py-[10px] px-[18px] rounded-[8px] bg-[#DD2590] text-white text-[16px] font-[600] hover:bg-[#dd2590df] ${
              open ? 'block w-full mt-[30px]' : 'hidden'
            }`}
            onClick={() => signIn()}>
            Log In
          </button>
        )}
      </div>

      {!session && (
        <button
          className={`py-[10px] px-[18px] rounded-[8px] bg-[#DD2590] text-white text-[16px] font-[600] hover:bg-[#dd2590df] ${
            open ? 'hidden sm:block w-full mt-[30px]' : 'hidden sm:block'
          }`}
          onClick={() => signIn()}>
          Log In with Github
        </button>
      )}
      {!session && (
        <div
          className="max-w-[25px] cursor-pointer sm:hidden block"
          onClick={() => setIsOpen(!open)}>
          <Image src={open ? cross : hamburger} alt="hamburger" />
        </div>
      )}
    </div>
  );
}
