import { sortArticles } from '../articleFormatters';
import { Article } from '../../types/article';

describe('sortArticles', () => {
  const fixture: Article[] = [
    {
      id: 1,
      title: 'Story A',
      url: 'https://example.com/a',
      author: 'alice',
      score: 10,
      time: 1000,
      domain: 'example.com',
      faviconUrl: 'https://www.google.com/s2/favicons?domain=example.com&sz=64',
    },
    {
      id: 2,
      title: 'Story B',
      url: 'https://example.com/b',
      author: 'bob',
      score: 70,
      time: 2000,
      domain: 'example.com',
      faviconUrl: 'https://www.google.com/s2/favicons?domain=example.com&sz=64',
    },
  ];

  it('sorts by score descending', () => {
    const result = sortArticles(fixture, 'score');
    expect(result.map(item => item.id)).toEqual([2, 1]);
  });

  it('sorts by time descending', () => {
    const result = sortArticles(fixture, 'time');
    expect(result.map(item => item.id)).toEqual([2, 1]);
  });
});
