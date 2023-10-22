import type { NextPage } from 'next';
import UserPage from './[username]';

const Home: NextPage = () => {
  return (
    <div className="sm:bg-[#F9FAFB] bg-white">
      <UserPage />
    </div>
  );
};

export default Home;
