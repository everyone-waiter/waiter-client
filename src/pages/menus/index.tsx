import { useParams } from 'react-router-dom';
import { fetcher } from '../../utils/fetcher';
import useSWRImmutable from 'swr/immutable';
import { CategoryResponse } from '../../types/category';
import { useEffect, useState } from 'react';
import { AppSpinner } from '../../components/AppSpinner';
import { Categories } from './Categories';
import { MenuList } from './MenuList';

export function MenuForm() {
  const { memberId } = useParams();
  const [categoryId, setCategoryId] = useState<number>(0);
  const { data: categoryList, isLoading: categoryIsLoading } = useSWRImmutable<CategoryResponse[]>(
    `/api/categories/${memberId}`,
    fetcher,
  );

  useEffect(() => {
    if (!categoryIsLoading) return setCategoryId(categoryList ? categoryList[0].id : -1);
  }, [categoryIsLoading, categoryList, setCategoryId]);

  if (categoryIsLoading) return <AppSpinner />;

  return (
    <>
      <Categories setCategoryId={setCategoryId} categoryList={categoryList} />
      <MenuList categoryId={categoryId} />
    </>
  );
}
