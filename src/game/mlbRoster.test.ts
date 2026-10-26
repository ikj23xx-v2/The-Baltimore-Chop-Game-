import test from 'node:test';
import assert from 'node:assert';
import { ALL_PLAYERS, INITIAL_ROSTER } from '../data/players';
import { MLB_TEAMS, MLB_DIVISIONS } from '../data/mlbTeams';

test('Confirms exactly 30 official MLB franchises in database', () => {
  assert.strictEqual(MLB_TEAMS.length, 30, 'Should have exactly 30 MLB teams in registry');
  assert.strictEqual(MLB_DIVISIONS.length, 6, 'Should have 6 official MLB divisions');

  const teamNamesInRegistry = new Set(MLB_TEAMS.map(t => t.name));
  assert.strictEqual(teamNamesInRegistry.size, 30, 'All 30 teams must have unique names');

  // Verify key franchises exist
  const expectedTeams = [
    'Baltimore Orioles', 'New York Yankees', 'Boston Red Sox', 'Toronto Blue Jays', 'Tampa Bay Rays',
    'Los Angeles Dodgers', 'San Francisco Giants', 'San Diego Padres', 'Atlanta Braves', 'Philadelphia Phillies',
    'Chicago Cubs', 'Chicago White Sox', 'Houston Astros', 'Texas Rangers', 'Seattle Mariners'
  ];
  for (const team of expectedTeams) {
    assert.ok(teamNamesInRegistry.has(team), `Team ${team} should exist in MLB registry`);
  }
});

test('Every single MLB franchise has an active 26-man roster (780 MLB cards + 50 Negro League Legends = 830 total)', () => {
  assert.strictEqual(ALL_PLAYERS.length, 830, 'Total card count should be 830 (780 MLB + 50 Negro League Legends)');

  for (const team of MLB_TEAMS) {
    const teamPlayers = ALL_PLAYERS.filter(p => p.team === team.name);
    assert.strictEqual(
      teamPlayers.length,
      26,
      `Team "${team.name}" must have exactly 26 active players on roster, found ${teamPlayers.length}`
    );

    // Verify 13 position players and 13 pitchers (5 SP, 8 RP)
    const pitchers = teamPlayers.filter(p => p.position === 'SP' || p.position === 'RP');
    const positionPlayers = teamPlayers.filter(p => p.position !== 'SP' && p.position !== 'RP');

    assert.strictEqual(
      pitchers.length,
      13,
      `Team "${team.name}" must have 13 active pitchers (found ${pitchers.length})`
    );
    assert.strictEqual(
      positionPlayers.length,
      13,
      `Team "${team.name}" must have 13 active position players (found ${positionPlayers.length})`
    );

    const sp = teamPlayers.filter(p => p.position === 'SP');
    const rp = teamPlayers.filter(p => p.position === 'RP');
    assert.strictEqual(sp.length, 5, `Team "${team.name}" must have a 5-man starting rotation`);
    assert.strictEqual(rp.length, 8, `Team "${team.name}" must have an 8-man bullpen`);
  }
});

test('Initial active roster provides a balanced 26-man Orioles squad', () => {
  assert.strictEqual(INITIAL_ROSTER.length, 26, 'Initial user roster should be a complete 26-man squad');
  const allOrioles = INITIAL_ROSTER.every(p => p.team === 'Baltimore Orioles');
  assert.ok(allOrioles, 'Initial roster cards should all belong to Baltimore Orioles');

  // Verify iconic names are present
  const names = INITIAL_ROSTER.map(p => p.name);
  assert.ok(names.includes('Cal Ripken Jr.'), 'Cal Ripken Jr. should be on initial roster');
  assert.ok(names.includes('Adley Rutschman'), 'Adley Rutschman should be on initial roster');
  assert.ok(names.includes('Gunnar Henderson'), 'Gunnar Henderson should be on initial roster');
  assert.ok(names.includes('Corbin Burnes'), 'Corbin Burnes should be on initial roster');
});
