import { useEffect, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import { ShowMenuList } from './ShowMenuList';
import { MenuResponse } from '../../types/menu';
import { Container, Grid } from '@mui/material';
import { getFetcher } from '../../utils/fetcher';
import { AppSpinner } from '../../components/AppSpinner';

export function MenuList({ categoryId }: { categoryId: number }) {
  const [isMounted, setIsMounted] = useState(false);
  const { data, isLoading } = useSWRImmutable<MenuResponse[]>(
    isMounted ? `/api/menus/category/${categoryId}` : null,
    getFetcher,
  );

  useEffect(() => {
    if (categoryId !== 0) return setIsMounted(true);
  }, [categoryId, setIsMounted]);

  if (isLoading) return <AppSpinner />;

  return (
    <>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={3}>
          {data?.map((menu) => {
            return (
              <ShowMenuList
                key={menu.id}
                id={menu.id}
                name={menu.name}
                description={menu.description}
                image={menu.image}
                price={menu.price}
                spicy={menu.spicy}
                status={menu.status}
                notice={menu.notice}
                sort={menu.sort}
              />
            );
          })}
        </Grid>
      </Container>
    </>
  );
}
