'use client';

import CategoriesApiService from '@/api-services/api/CategoriesApiService';
import { Empty, Spin } from 'antd';
import React, { useState } from 'react';
import ItemCategory from './item-category/ItemCategory';
import SelectByLanguage from '@/components/ui/select-language/SelectByLanguage';
import './Category.scss';
import { useQuery } from '@tanstack/react-query';

export default function Category() {
  const [language, setLanguage] = useState('uk');
  const [queryKey, setQueryKey] = useState(['category', language]);

  const fetchCategories = async (language) => {
    let result = await CategoriesApiService.getCategories(language);
    if (result && result.category) {
      let sortedData = result.category.map((cat) => {
        return {
          ...cat,
          child: cat.child
            .map((subCat) => {
              return {
                ...subCat,
                child: subCat.child.sort((a, b) => b.app_count - a.app_count),
              };
            })
            .sort((a, b) => b.app_count - a.app_count),
        };
      });
      return sortedData;
    }
  };

  const { data: dataCategories, isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchCategories(language),
    enabled: !!language,
  });

  const renderedList = dataCategories
    ? dataCategories.map((item, index) => {
        return (
          <div className="item-list" key={'' + index}>
            <ItemCategory value={item} language={language} />
          </div>
        );
      })
    : '';

  const handleSelectChange = (value) => {
    setLanguage(value);
    setQueryKey(['category', value]);
  };

  return (
    <Spin spinning={isLoading}>
      <div className="categories container">
        <div className="header-categories">
          <h1 className="header-categories-title">Categories</h1>
          <SelectByLanguage selectValue={language} handleSelectChange={handleSelectChange} />
        </div>
        {dataCategories && dataCategories.length > 0 ? <>{renderedList}</> : <Empty />}
      </div>
    </Spin>
  );
}
