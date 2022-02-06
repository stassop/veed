import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { Repo } from '../types';
import mocks from './mocks.json';
import App from '../components/App';

const server = setupServer(
  rest.get('*/repositories', (req, res, ctx) => {
    // console.log('CALL TO API!');
    return res(ctx.json(mocks));
  }),
)

beforeAll(() => server.listen());
beforeEach(() => window.localStorage.clear()); // important!
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App', () => {
  test('renders correctly', async () => {
    render(<App />);

    const data = mocks.items[0] as Repo;

    const repo = await screen.findByTestId(`repo-${data.id}`);

    expect(repo).toBeInTheDocument();

    const name = await within(repo).findByText(data.name);
    const owner = await within(repo).findByText(data.owner.login);
    const avatar = await within(repo).findByAltText(data.owner.login);
    const description = await within(repo).findByText(data.description);

    expect(name).toBeInTheDocument();
    expect(owner).toBeInTheDocument();
    expect(avatar).toBeInTheDocument();
    expect(description).toBeInTheDocument();

    expect(name.closest('a')).toHaveAttribute('href', data.html_url);
    expect(owner.closest('a')).toHaveAttribute('href', data.owner.html_url);
    expect(avatar).toHaveAttribute('src', data.owner.avatar_url);
  });

  test('handles star button click', async () => {
    render(<App />);

    const data = mocks.items[0] as Repo;

    const repo = await screen.findByTestId(`repo-${data.id}`);
    const stars = await within(repo).findByText(`${data.stargazers_count}`);
    const starButton = await screen.findByTestId(`repo-star-button-${data.id}`);

    expect(repo).toBeInTheDocument();
    expect(stars).toBeInTheDocument();
    expect(starButton).toBeInTheDocument();

    fireEvent.click(starButton);

    await waitFor(() => {
      expect(stars).toHaveTextContent(`${data.stargazers_count + 1}`);
    });
  });

  test('filters by language', async () => {
    render(<App />);

    const data = mocks.items as Repo[];

    const repo1 = await screen.findByTestId(`repo-${data[0].id}`);
    const repo2 = await screen.findByTestId(`repo-${data[1].id}`);
    const filter = await screen.findByLabelText(data[0].language!); // assert not null cuz mocks

    expect(repo1).toBeInTheDocument();
    expect(repo2).toBeInTheDocument();
    expect(filter).toBeInTheDocument();

    fireEvent.click(filter);

    await waitFor(() => {
      expect(repo1).toBeInTheDocument();
      expect(repo2).not.toBeInTheDocument();
    });
  });

  test('filters by starred', async () => {
    render(<App />);

    const data = mocks.items as Repo[];

    const repo1 = await screen.findByTestId(`repo-${data[0].id}`);
    const repo2 = await screen.findByTestId(`repo-${data[1].id}`);

    expect(repo1).toBeInTheDocument();
    expect(repo2).toBeInTheDocument();

    const starButton = await screen.findByTestId(`repo-star-button-${data[0].id}`);
    const starredFilter = await screen.findByLabelText(/^.+\sStarred by you$/); // ignore HTML entities

    expect(starButton).toBeInTheDocument();
    expect(starredFilter).toBeInTheDocument();

    fireEvent.click(starButton);
    fireEvent.click(starredFilter);

    await waitFor(() => {
      expect(repo1).toBeInTheDocument();
      expect(repo2).not.toBeInTheDocument();
    });
  });
});
