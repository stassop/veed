import React, { useEffect, useState, useCallback } from 'react';

import '../styles/RepoList.css';
import { Repo } from '../types';
import RepoListItem from './RepoListItem';
import RepoListFilter from './RepoListFilter';
import useLocalStorage from '../hooks/useLocalStorage';

interface RepoListProps {
  repos: Repo[] | undefined,
}

const RepoList: React.FC<RepoListProps> = ({ repos = [] }: RepoListProps) => {
  const [filtered, setFiltered] = useState<Repo[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [showStarred, setShowStarred] = useState<boolean>(false);
  const [starred, setStarred] = useLocalStorage<number[]>('starred', []);

  useEffect(() => {
    const filtered: Repo[] = selectedLanguages.length > 0 || showStarred
      ? repos.filter((repo: Repo) =>
          repo.language !== null && selectedLanguages.includes(repo.language)
          || showStarred && starred.includes(repo.id))
      : repos;
    setFiltered(filtered);
  }, [repos, selectedLanguages, showStarred, starred]);

  useEffect(() => {
    const languages: string[] = repos.reduce((list: string[], repo: Repo) => {
      return repo.language === null || list.includes(repo.language)
        ? list
        : [...list, repo.language];
    }, []);
    setLanguages(languages);
  }, [repos]);

  const onLanguageSelected = useCallback((language: string, isSelected: boolean) => {
    const newSelection: string[] = isSelected
      ? [...selectedLanguages, language]
      : selectedLanguages.filter((item: string) => item !== language);
    setSelectedLanguages(newSelection);
  }, [selectedLanguages]);

  const onShowStarredChanged = (isSelected: boolean) => {
    setShowStarred(isSelected);
  };

  const onRepoStarred = useCallback((id: number, isStarred: boolean) => {
    const newSelection: number[] = isStarred
      ? [...starred, id]
      : starred.filter((item: number) => item !== id);
    setStarred(newSelection);
  }, [starred]);

  return (
    <div className="RepoList">
      { languages.map((language: string) => (
          <RepoListFilter
            key={language}
            name={language}
            isSelected={selectedLanguages.includes(language)}
            onSelected={(isSelected: boolean) => onLanguageSelected(language, isSelected)}
          >
            {language}
          </RepoListFilter>
        ))
      }
      <RepoListFilter
        name="starred"
        isSelected={showStarred}
        onSelected={(isSelected: boolean) => onShowStarredChanged(isSelected)}
      >
        &#9733; Starred by you
      </RepoListFilter>
      <ul>
        { filtered.map((repo: Repo) => (
            <li key={repo.id}>
              <RepoListItem
                id={repo.id}
                name={repo.name}
                description={repo.description}
                stars={repo.stargazers_count}
                isStarred={starred.includes(repo.id)}
                onStarred={(isStarred: boolean) => onRepoStarred(repo.id, isStarred)}
                ownerAvatarUrl={repo.owner.avatar_url}
                ownerName={repo.owner.login}
                ownerUrl={repo.owner.html_url}
                url={repo.html_url}
              />
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default React.memo(RepoList);
