import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useQuery } from 'react-query';

import '../styles/Repos.css';
import { Results, Repo } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

const getRepos = async (date: string): Promise<Results> => {
  const url = `https://api.github.com/search/repositories?q=created:>${date}&sort=stars&order=desc`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const Repos: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [showStarred, setShowStarred] = useState<boolean>(false);
  const [starred, setStarred] = useLocalStorage<number[]>('starred', []);

  const isoDate = useMemo(() => {
    const date = Date.now() - 1000 * 60 * 60 * 24 * 7; // 7 days ago
    return new Date(date).toISOString().substring(0,10);
  }, []);

  const { data, error, isFetching, isSuccess, isError } = useQuery<Results, Error>(['repos', isoDate], () => getRepos(isoDate));

  useEffect(() => {
    if (data) {
      const repos = selectedLanguages.length > 0 || showStarred
        ? data.items.filter((repo: Repo) =>
            showStarred && starred.includes(repo.id)
            || selectedLanguages.includes(repo.language))
        : data.items;
      setRepos(repos);
    }
  }, [isSuccess, selectedLanguages, showStarred, starred]);

  useEffect(() => {
    if (data) {
      const languages = data.items.reduce((list: string[], repo: Repo) => {
        return list.includes(repo.language) || repo.language === null
          ? list
          : [...list, repo.language];
      }, []);
      setLanguages(languages);
    }
  }, [isSuccess]);

  const onLanguageSelected = useCallback(({ target: checkbox }: React.ChangeEvent<HTMLInputElement>) => {
    const language = checkbox.name;
    const isSelected = checkbox.checked;
    const newSelection = isSelected
      ? [...selectedLanguages, language]
      : selectedLanguages.filter((item: string) => item !== language);
    setSelectedLanguages(newSelection);
  }, [selectedLanguages]);

  const onShowStarredChanged = ({ target: checkbox }: React.ChangeEvent<HTMLInputElement>) => {
    setShowStarred(checkbox.checked);
  };

  const onRepoStarred = useCallback(({ currentTarget: button }: React.MouseEvent<HTMLButtonElement>) => {
    const repoId = parseInt(button.value);
    const isStarred = starred.includes(repoId);
    const newSelection = isStarred
      ? starred.filter((item: number) => item !== repoId)
      : [...starred, repoId];
    setStarred(newSelection);
  }, [starred]);

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
    <>
      { languages.map((language: string) => (
          <div
            key={language}
            className="Repos-filter"
          >
            <input type="checkbox"
              id={`filter-${language}`}
              name={language}
              checked={selectedLanguages.includes(language)}
              onChange={onLanguageSelected}
            />
            <label htmlFor={`filter-${language}`}>
              {language}
            </label>
          </div>
        ))
      }
      <div className="Repos-filter">
        <input type="checkbox"
          id="filter-starred"
          name="starred"
          checked={showStarred}
          onChange={onShowStarredChanged}
        />
        <label htmlFor="filter-starred">
          &#9733; Starred by you
        </label>
      </div>
      <ul className="Repo-list">
        { repos.map((repo: Repo) => (
            <li
              key={repo.id}
              className="Repo"
              data-testid={`repo-${repo.id}`}
            >
              <div className="Repo-header">
                <a href={repo.html_url}>
                  {repo.name}
                </a>&nbsp;
                <span>&#9733;</span>
                <span>{repo.stargazers_count + (starred.includes(repo.id) ? 1 : 0)}</span>&nbsp;
                <button
                  className="Repo-star-button"
                  onClick={onRepoStarred}
                  value={repo.id}
                  data-testid={`repo-star-button-${repo.id}`}
                >
                  { starred.includes(repo.id)
                      ? <span>&#9733; Unstar</span>
                      : <span>&#9734; Star</span>
                  }
                </button>
              </div>
              <div className="Repo-owner-avatar">
                <img
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  width="40"
                  height="40"
                />
              </div>by&nbsp;
              <a href={repo.owner.html_url}>
                {repo.owner.login}
              </a>
              <p>{repo.description}</p>
            </li>
          ))
        }
      </ul>
    </>
  );
};

export default Repos;
