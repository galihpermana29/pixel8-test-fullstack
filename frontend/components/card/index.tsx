import { MinimalRepository } from 'utils/interfaces';
import { formatDate } from 'utils/utility';

interface CardsI {
  data: MinimalRepository | null | undefined;
}

export default function Cards({ data }: CardsI): JSX.Element {
  const {
    name,
    description,
    language,
    updated_at,
    private: privateRepo,
  } = data ?? {
    name: null,
    description: null,
    language: null,
    updated_at: null,
    private: null,
  };

  return (
    <div className="p-[24px] bg-[#F9FAFB] rounded-[8px] border-2 border-[#EAECF0] w-full">
      <div className="flex flex-wrap gap-[12px]">
        <p className="text-[16px] font-[700] text-[#101828]">
          {name ? name : '-'}
        </p>
        <div className="text-[#5925DC] text-[12px] font-[500] bg-[#F4F3FF] px-[8px] py-[2px] rounded-[16px]">
          {privateRepo ? 'private' : 'public'}
        </div>
      </div>

      {description && (
        <div className="mt-[8px]">
          <p className="text-[#101828] text-[14px] font-[400]">{description}</p>
        </div>
      )}

      <div className="flex items-center gap-[20px] mt-[24px]">
        {language && (
          <div className="flex items-center gap-[8px]">
            <div className="w-[12px] h-[12px] rounded-full bg-[#B42318]"></div>
            <p className="text-[12px] font-[400] text-[#101828]">{language}</p>
          </div>
        )}
        <div className="text-[12px] font-[400] text-[#475467]">
          updated {updated_at ? formatDate(updated_at as string) : '-'}
        </div>
      </div>
    </div>
  );
}
