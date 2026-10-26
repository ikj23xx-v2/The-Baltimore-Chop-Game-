import test from 'node:test';
import assert from 'node:assert/strict';
import { TWELVE_SEASONS, getActiveSeason, isSeasonUnlocked } from '../data/seasons';
import { forumService } from '../services/forumService';

test('12 seasons are configured with Season 1 starting 11/1', () => {
  assert.equal(TWELVE_SEASONS.length, 12);
  
  const season1 = TWELVE_SEASONS[0];
  assert.equal(season1.seasonNumber, 1);
  assert.equal(season1.startDate, '11/1');
  assert.equal(season1.status, 'ACTIVE');
  assert.equal(season1.isUnlocked, true);
  assert.equal(season1.toppsLikenessSet, 'Topps Update Series Flagship');
});

test('Seasons 2 through 12 are strictly locked until their start date', () => {
  for (let i = 1; i < TWELVE_SEASONS.length; i++) {
    const s = TWELVE_SEASONS[i];
    assert.equal(s.isUnlocked, false, `Season ${s.seasonNumber} must be locked initially`);
    assert.equal(s.status, 'UPCOMING');
    assert.ok(s.startDate.length > 0);
    assert.ok(s.actualHobbyReleaseDate.length > 0);
    assert.ok(s.toppsLikenessSet.length > 0);
    assert.equal(isSeasonUnlocked(s.seasonNumber), false);
  }
});

test('ForumService supports category filtering, posting, and upvoting', () => {
  const allPosts = forumService.getPosts('ALL');
  assert.ok(allPosts.length >= 4);

  const initialUpvotes = allPosts[0].upvotes;
  const newUpvotes = forumService.upvote(allPosts[0].id);
  assert.equal(newUpvotes, initialUpvotes + 1);

  const created = forumService.createPost({
    category: 'CHOP_STRATEGY',
    title: 'Test Thread',
    content: 'Testing forum post',
    author: 'TestUser',
    avatarIcon: '⚡',
    tags: ['Test']
  });

  assert.equal(created.title, 'Test Thread');
  assert.equal(created.upvotes, 1);
});
