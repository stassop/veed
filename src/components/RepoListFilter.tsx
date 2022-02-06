import React from 'react';

import '../styles/RepoListFilter.css';

interface RepoListFilterProps {
  name: string,
  isSelected: boolean,
  onSelected: (isSelected: boolean) => void,
  children: string,
}

const RepoListFilter: React.FC<RepoListFilterProps> = ({
  name,
  isSelected,
  onSelected,
  children,
}: RepoListFilterProps) => {
  const onChange = ({ target: checkbox }: React.ChangeEvent<HTMLInputElement>) => {
    onSelected(checkbox.checked);
  };

  return (
    <div className="RepoListFilter">
      <input type="checkbox"
        id={`filter-${name}`}
        name={name}
        checked={isSelected}
        onChange={onChange}
      />
      <label htmlFor={`filter-${name}`}>
        {children}
      </label>
    </div>
  );
};

export default RepoListFilter;
