import React, { useMemo } from 'react';
import { useQuery } from 'react-query';

import '../styles/RepoList.css';
import { Results } from '../types';
import RepoList from './RepoList';

const getRepos = async (date: string): Promise<Results> => {
  const url = `https://api.github.com/search/repositories?q=created:>${date}&sort=stars&order=desc`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const Repos: React.FC = () => {
  const isoDate = useMemo(() => {
    const date = Date.now() - 1000 * 60 * 60 * 24 * 7; // 7 days ago
    return new Date(date).toISOString().substring(0,10);
  }, []);

  const { data, error, isFetching, isError } =
    useQuery<Results, Error>(['repos', isoDate], () => getRepos(isoDate));

  if (isFetching) {
    return (
      <p>Fetching...</p>
    );
  }

  if (isError) {
    return (
      <p>Error: {error?.message || 'Oops! Something went wrong!'}</p>
    );
  }

  return (
    <RepoList repos={data?.items} />
  );
};

export default Repos;
