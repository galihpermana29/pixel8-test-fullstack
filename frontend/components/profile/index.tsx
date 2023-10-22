import { GithubUser, LoginDataResponseI } from 'utils/interfaces';
import DescriptionProfile from './description';
import LatestVisitors from './latest-visitors';
import ProfilePic from './profile-pic';

interface UserDataI {
  userData: GithubUser | null | undefined;
  statistic: LoginDataResponseI;
}

export default function Profile({
  userData,
  statistic,
}: UserDataI): JSX.Element {
  const { bio, avatar_url, login, name, email } = userData ?? {
    bio: null,
    avatar_url: null,
    login: null,
    name: null,
    email: null,
  };
  const profileData = { avatar_url, login, name };
  const descData = { bio, email, visitor_counter: statistic?.visitor_counter };

  return (
    <div className="w-full flex-1">
      <ProfilePic data={profileData} />
      <DescriptionProfile data={descData} />
      <LatestVisitors data={statistic} />
    </div>
  );
}
