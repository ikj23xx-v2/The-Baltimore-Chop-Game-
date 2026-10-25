import test from 'node:test';
import assert from 'node:assert/strict';
import { CARD_SETS } from '../data/sets';
import { ALL_PLAYERS } from '../data/players';
import { CardSetId } from '../types/game';

test('8 official seasonal sets are defined with complete metadata and expirations', () => {
  assert.equal(CARD_SETS.length, 8);
  
  const expectedSetIds: CardSetId[] = [
    'SERIES_1',
    'HERITAGE',
    'BOWMAN',
    'SERIES_2',
    'CHROME',
    'STADIUM_CLUB',
    'ALLEN_GINTER',
    'UPDATE_SERIES'
  ];

  for (const id of expectedSetIds) {
    const set = CARD_SETS.find(s => s.id === id);
    assert.ok(set, `Set ${id} should exist`);
    assert.ok(set.name.length > 0);
    assert.ok(set.dropWindow.length > 0);
    assert.ok(set.borderTheme.length > 0);
    assert.ok(set.colorAccents.length > 0);
    assert.ok(set.totalCards > 0);
    assert.ok(typeof set.daysRemaining === 'number');
  }
});

test('All players have valid attributes, stats, and recognized set assignments', () => {
  assert.ok(ALL_PLAYERS.length >= 26);
  
  for (const player of ALL_PLAYERS) {
    assert.ok(player.name.length > 0);
    assert.ok(player.team.length > 0);
    assert.ok(player.position.length > 0);
    assert.ok(player.stats.contact > 0);
    assert.ok(player.bRefWar !== undefined);
    
    // Set ID should match one of the 8 CARD_SETS
    const setId = player.cardSetId || 'SERIES_1';
    assert.ok(
      CARD_SETS.some(s => s.id === setId),
      `Player ${player.name} set ${setId} should be a recognized set`
    );
  }
});

test('Expiration mechanics accurately identify active vs upcoming sets', () => {
  const activeSets = CARD_SETS.filter(s => s.status === 'ACTIVE');
  const upcomingSets = CARD_SETS.filter(s => s.status === 'UPCOMING');
  
  assert.ok(activeSets.length > 0, 'Should have active sets');
  assert.ok(upcomingSets.length > 0, 'Should have upcoming sets for anticipation');
  
  for (const s of activeSets) {
    assert.ok(s.daysRemaining > 0, `Active set ${s.name} should have positive days remaining`);
  }
});
