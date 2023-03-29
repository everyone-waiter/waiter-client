import React, { useState } from 'react';
import { AppBar, Tab, Tabs } from '@mui/material';
import { CategoryResponse } from '../../types/category';

export function Categories({
  setCategoryId,
  categoryList,
}: {
  setCategoryId: React.Dispatch<React.SetStateAction<number>>;
  categoryList: CategoryResponse[] | undefined;
}) {
  const [tabsIndex, setTabsIndex] = useState(0);

  const handleMainCategoryChange = (_event: React.SyntheticEvent, categoryIndex: any) => {
    setTabsIndex(categoryIndex);
    if (categoryList) {
      setCategoryId(categoryList[categoryIndex].id);
    }
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white' }}>
      <Tabs
        value={tabsIndex}
        onChange={handleMainCategoryChange}
        variant="scrollable"
        scrollButtons={false}
        aria-label="naru-menu-category"
      >
        {categoryList?.map((category) => {
          return <Tab key={category.id} label={category.name} />;
        })}
      </Tabs>
    </AppBar>
  );
}
