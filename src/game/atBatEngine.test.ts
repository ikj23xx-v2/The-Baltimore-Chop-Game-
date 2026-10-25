import test from 'node:test';
import assert from 'node:assert/strict';
import { AtBatEngine } from './atBatEngine';
import { PlayerCard } from '../types/game';

const mockBatter: PlayerCard = {
  id: 'B_TEST',
  name: 'Cal Ripken Jr.',
  team: 'Orioles',
  position: 'SS',
  bRefWar: 95.9,
  isHistorical: true,
  era: '1996',
  stats: { contact: 95, power: 85, speed: 70, fielding: 98 },
  refractorTier: 'RAINBOW',
  bio: 'Iron Man test card',
  avatarIcon: '👑'
};

const mockPitcher: PlayerCard = {
  id: 'P_TEST',
  name: 'Modern Ace',
  team: 'Opponents',
  position: 'SP',
  bRefWar: 5.0,
  isHistorical: false,
  era: '2024',
  stats: { contact: 10, power: 10, speed: 40, fielding: 70, stuff: 80, control: 80 },
  refractorTier: 'BASE',
  bio: 'Opponent Ace',
  avatarIcon: '⚾'
};

test('Baltimore Chop triggers infield single on downward zone or sinker', () => {
  const result = AtBatEngine.resolvePitch(
    { type: 'SINKER', zone: 'DOWN_IN', velocity: 93, breakRating: 85 },
    { guessType: 'SINKER', guessZone: 'DOWN_IN', specialSkill: 'BALTIMORE_CHOP' },
    mockBatter,
    mockPitcher,
    { chopBounceBonus: 40 }
  );

  assert.equal(result.outcome, 'INFIELD_SINGLE_CHOP');
  assert.equal(result.isBaltimoreChop, true);
  assert.equal(result.hapticPattern, 'CHOP');
  assert.ok(result.hitData?.bounceHeight! >= 25);
});

test('Base runner advancement correctly scores runs on single and home run', () => {
  // Bases loaded [1B, 2B, 3B]
  const loaded: [boolean, boolean, boolean] = [true, true, true];
  
  // Single: 1 runner scores, bases now [1B, 2B, 3B]
  const singleRes = AtBatEngine.advanceRunners(loaded, 1);
  assert.equal(singleRes.runsScored, 1);
  assert.deepEqual(singleRes.nextRunners, [true, true, true]);

  // Grand slam (Home Run: 4 bases)
  const hrRes = AtBatEngine.advanceRunners(loaded, 4);
  assert.equal(hrRes.runsScored, 4);
  assert.deepEqual(hrRes.nextRunners, [false, false, false]);

  // Double with runner on 1st: [true, false, false]
  const runnerOnFirst: [boolean, boolean, boolean] = [true, false, false];
  const doubleRes = AtBatEngine.advanceRunners(runnerOnFirst, 2);
  assert.equal(doubleRes.runsScored, 0);
  assert.deepEqual(doubleRes.nextRunners, [false, true, true]); // Batter on 2B, runner from 1B on 3B
});

test('Generates valid pitch with correct zone and positive velocity', () => {
  const pitch = AtBatEngine.generatePitch(mockPitcher);
  assert.ok(AtBatEngine.PITCH_TYPES.includes(pitch.type));
  assert.ok(AtBatEngine.STRIKE_ZONES.includes(pitch.zone));
  assert.ok(pitch.velocity >= 70 && pitch.velocity <= 105);
  assert.ok(pitch.breakRating >= 0 && pitch.breakRating <= 99);
});
