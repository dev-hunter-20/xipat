'use client';

import Input from '@/components/ui/input/Input';
import SelectByLanguage from '@/components/ui/select-language/SelectByLanguage';
import { Empty, Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import './Collection.scss';
import CollectionApiService from '@/api-services/api/CollectionApiService';

export default function Collection() {
  const [dataCollections, setDataCollections] = useState();
  const [dataSearch, setDataSearch] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('uk');

  useEffect(() => {
    fetchCollections(language);
  }, [language]);

  const fetchCollections = async (language) => {
    setIsLoading(true);
    let result = await CollectionApiService.getCollections(language);
    if (result && result.collection) {
      setDataCollections(result.collection.sort((a, b) => b.app_count - a.app_count));
    }
    setIsLoading(false);
  };

  const renderedList = useMemo(() => {
    if (dataSearch) {
      return dataSearch;
    }
    if (dataCollections && dataCollections.length > 0) {
      return dataCollections;
    }
    return [];
  }, [dataCollections, dataSearch]);

  const handleSelectChange = (value) => {
    setLanguage(value);
    fetchCollections(value);
  };

  const onSearch = async (value) => {
    if (value) {
      const listSearch = dataCollections.filter((item) => item.text.toLowerCase().includes(value.toLowerCase()));
      if (listSearch && listSearch.length > 0) {
        setDataSearch(listSearch);
        return;
      }
      setDataSearch([]);
      return;
    }
    setDataSearch(null);
  };

  return (
    <Spin spinning={isLoading}>
      <div className="collections container">
        <div className="header-collections">
          <h1 className="header-collections-title">Collections</h1>
          <div className="flex">
            <Input placeholder="Search" onSearch={onSearch} className="search-input" />
            <SelectByLanguage selectValue={language} handleSelectChange={handleSelectChange} />
          </div>
        </div>
        {renderedList && renderedList.length > 0 ? (
          <div className="item-list">
            <div className="item-collections">
              {renderedList.map((item, index) => (
                <div key={index} className="item-list-collections">
                  <a href={`/collection/${item.slug}`}>{item.text}</a>
                  <div className="amount-app">{item.app_count} apps</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Empty />
        )}
      </div>
    </Spin>
  );
}
