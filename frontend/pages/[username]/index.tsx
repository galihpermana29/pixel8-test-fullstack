import Profile from '@/components/profile';
import Repository from '@/components/repository';
import GithubAPI from 'api/github';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  GithubUser,
  LoginDataResponseI,
  LoginPayloadI,
  LoginResponseI,
  MinimalRepository,
} from 'utils/interfaces';

import type { GetServerSideProps } from 'next';
import { handleError, handleErrorServerSide } from 'utils/errorHandler';
import { useSession } from 'next-auth/react';
import WebsiteAPI from 'api/website';

interface UserPageI {
  userProfile?: GithubUser | null;
  userRepo?: MinimalRepository[] | null;
  error?: 'limit' | 'notfound' | 'unknown';
  ipAdd?: string;
}

export default function UserPage({
  userProfile,
  userRepo,
  ipAdd,
  error,
}: UserPageI): JSX.Element {
  const router = useRouter();
  const { data: session } = useSession();

  const [profileVisitors, setProfileVisitors] =
    useState<LoginDataResponseI | null>(null);

  const createUserWithVisitor = async (payload: LoginPayloadI) => {
    try {
      const data = await WebsiteAPI.login(payload);
      setProfileVisitors(data?.data);
    } catch (error) {
      handleError(error as AxiosError, toast);
    }
  };

  const updateCountForGuest = async (payload: LoginPayloadI) => {
    try {
      const data = await WebsiteAPI.updateCount(payload);
      setProfileVisitors(data?.data);
    } catch (error) {
      handleError(error as AxiosError, toast);
    }
  };

  useEffect(() => {
    if (error === 'limit') {
      toast.error('Error occurs cause of api limit ');
    }

    if (error === 'notfound') {
      toast.error('Not Found');
      router.push('/octocat');
    }

    if (error === 'unknown') {
      toast.error('Error happen!');
      router.push('/octocat');
    }

    if (!userProfile) router.push('/octocat');

    localStorage.setItem('ip_client', ipAdd as string);
  }, []);

  useEffect(() => {
    const loggedUsername = localStorage.getItem('user');
    if (session && router.query.username) {
      let payload: LoginPayloadI;
      if (loggedUsername === router.query.username) {
        payload = {
          username: router.query.username as string,
        };
      } else {
        payload = {
          username: router.query.username as string,
          visitor: {
            username: loggedUsername as string,
            avatar_url: session?.user?.image as string,
          },
        };
      }
      createUserWithVisitor(payload);
    }
  }, [session, router.query]);

  useEffect(() => {
    const loggedUsername = localStorage.getItem('user');
    if (!loggedUsername && router.query.username) {
      const payload: LoginPayloadI = {
        username: router.query.username as string,
      };
      updateCountForGuest(payload);
    }
  }, []);

  return (
    <div>
      <ToastContainer />
      <div className=" sm:px-[50px] md:px-[112px] min-h-screen mt-[24px] flex sm:flex-row flex-col gap-[50px]">
        <div className="px-[24px] sm:px-0 w-full sm:max-w-[240px]">
          <Profile
            userData={userProfile}
            statistic={profileVisitors as LoginDataResponseI}
          />
        </div>
        <Repository userData={userRepo} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  let username = query.username;
  let returnObject: {
    props: {
      error?: string;
      userProfile?: GithubUser;
      userRepo?: MinimalRepository;
      ipAdd?: string;
    };
  };
  if (username === 'null') {
    returnObject = {
      props: {},
    };
  } else {
    try {
      const userProfile = await GithubAPI.getUserProfile(username as string);
      const userRepo = await GithubAPI.getUserRepos(
        username as string,
        'sort=updated_at&direction=desc&per_page=6'
      );
      const { data } = await axios.get('https://api.ipify.org/?format=json');
      returnObject = {
        props: { userProfile, userRepo, ipAdd: data.ip as string },
      };
    } catch (error) {
      returnObject = handleErrorServerSide(error as AxiosError);
    }
  }

  return returnObject;
};
