import { MinimalRepository } from 'utils/interfaces';
import Cards from '../card';

interface UserDataI {
  userData: MinimalRepository[] | null | undefined;
}

export default function Repository({ userData }: UserDataI): JSX.Element {
  const RenderRepoComp = (): JSX.Element => {
    if (!userData) {
      return <div>Something went wrong</div>;
    }

    if (userData && (userData as MinimalRepository[]).length > 0) {
      return (
        <div className="flex flex-col gap-[24px]">
          {userData?.map((data, idx) => (
            <div key={idx}>
              <Cards data={data} />
            </div>
          ))}
        </div>
      );
    }

    if (userData && (userData as MinimalRepository[]).length === 0) {
      return <div>Currently have no repositories</div>;
    }

    return <div></div>;
  };

  return (
    <div className="flex-1 bg-white p-[24px] rounded-[8px] border-2 border-[#F2F4F7]">
      <p className="text-[#101828] text-[24px] font-[700] mb-[24px]">
        Repository
      </p>
      <div>
        <RenderRepoComp />
      </div>
    </div>
  );
}
