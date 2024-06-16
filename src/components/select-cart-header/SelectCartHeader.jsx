'use client';

import React from 'react';
import { Select } from 'antd';
import './SelectCartHeader.scss';

const { Option } = Select;

export default function SelectCartHeader({
  title,
  value,
  options = [
    { label: 'Day', value: 'D' },
    { label: 'Week', value: 'W' },
    { label: 'Month', value: 'M' },
    { label: 'Quarter', value: 'Q' },
    { label: 'Year', value: 'Y' },
  ],
  onChange,
}) {
  return (
    <div className="select-option">
      <span className="title-name">{title}</span>
      <Select value={value} onChange={onChange} className="select">
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}
