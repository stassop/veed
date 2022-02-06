import React from 'react';

import '../styles/RepoListItem.css';

interface RepoListItemProps {
  id: number,
  name: string,
  description: string,
  stars: number,
  isStarred: boolean,
  onStarred: (isStarred: boolean) => void,
  ownerAvatarUrl: string,
  ownerName: string,
  ownerUrl: string,
  url: string,
}

const RepoListItem: React.FC<RepoListItemProps> = ({
  id,
  name,
  description,
  stars,
  isStarred,
  onStarred,
  ownerAvatarUrl,
  ownerName,
  ownerUrl,
  url,
}: RepoListItemProps) => (
  <div
    className="RepoListItem"
    data-testid={`repo-${id}`}
  >
    <div className="RepoListItem-header">
      <a href={url}>
        {name}
      </a>&nbsp;
      <span>&#9733;</span>
      <span>{stars + (isStarred ? 1 : 0)}</span>&nbsp;
      <button
        className="RepoListItem-star-button"
        onClick={() => onStarred(!isStarred)}
        data-testid={`repo-star-button-${id}`}
      >
        { isStarred
            ? <span>&#9733; Unstar</span>
            : <span>&#9734; Star</span>
        }
      </button>
    </div>
    <div className="RepoListItem-owner-avatar">
      <img
        src={ownerAvatarUrl}
        alt={ownerName}
        width="40"
        height="40"
      />
    </div>by&nbsp;
    <a href={ownerUrl}>
      {ownerName}
    </a>
    <p>{description}</p>
  </div>
);

export default React.memo(RepoListItem);
