import { MenuList } from './MenuList';
import { Categories } from './Categories';
import { useEffect, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import { useParams } from 'react-router-dom';
import { getFetcher } from '../../utils/fetcher';
import { CategoryResponse } from '../../types/category';
import { AppSpinner } from '../../components/AppSpinner';

export function MenuForm() {
  const { memberId } = useParams();
  const [categoryId, setCategoryId] = useState<number>(0);
  const { data: categoryList, isLoading: categoryIsLoading } = useSWRImmutable<
    CategoryResponse[]
  >(`/api/categories/${memberId}`, getFetcher);

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
