import { 
  PitchDelivery, 
  BatterCounter, 
  PlayerCard, 
  AtBatResult, 
  PitchType, 
  StrikeZone 
} from '../types/game';

export class AtBatEngine {
  public static readonly PITCH_TYPES: PitchType[] = [
    '4-SEAM', 'SLIDER', 'CURVEBALL', 'CHANGEUP', 'SINKER', 'CUTTER'
  ];

  public static readonly STRIKE_ZONES: StrikeZone[] = [
    'UP_IN', 'UP_MID', 'UP_OUT',
    'MID_IN', 'MIDDLE', 'MID_OUT',
    'DOWN_IN', 'DOWN_MID', 'DOWN_OUT'
  ];

  /**
   * Generates a realistic pitch delivery based on pitcher ratings.
   */
  public static generatePitch(pitcher?: PlayerCard): PitchDelivery {
    const stuff = pitcher?.stats.stuff ?? 75;
    const control = pitcher?.stats.control ?? 70;

    const type = this.PITCH_TYPES[Math.floor(Math.random() * this.PITCH_TYPES.length)];
    const zone = this.STRIKE_ZONES[Math.floor(Math.random() * this.STRIKE_ZONES.length)];

    let baseVelo = 91;
    if (type === '4-SEAM') baseVelo = 94 + (stuff / 25);
    else if (type === 'SINKER' || type === 'CUTTER') baseVelo = 92 + (stuff / 30);
    else if (type === 'SLIDER') baseVelo = 85 + (stuff / 35);
    else if (type === 'CHANGEUP') baseVelo = 83 + (control / 40);
    else if (type === 'CURVEBALL') baseVelo = 78 + (control / 45);

    const velocity = Math.round(baseVelo + (Math.random() * 4 - 2));
    const breakRating = Math.min(99, Math.round(stuff * 0.8 + (Math.random() * 20)));

    return { type, zone, velocity, breakRating };
  }

  /**
   * Signature Showdown Resolver
   */
  public static resolvePitch(
    pitch: PitchDelivery,
    counter: BatterCounter,
    batter: PlayerCard,
    pitcher: PlayerCard,
    equipmentBuffs: { contactBonus?: number; powerBonus?: number; chopBounceBonus?: number; pitchHintAccuracy?: number } = {},
    currentStreak: number = 0
  ): AtBatResult {
    const isDownZone = pitch.zone.startsWith('DOWN');
    const isSinker = pitch.type === 'SINKER';

    // 1. SIGNATURE MECHANIC: The Baltimore Chop
    // When batter triggers Baltimore Chop, hitting low pitch or sinker topspins ball straight down into hard clay
    if (counter.specialSkill === 'BALTIMORE_CHOP') {
      const chopEligible = isDownZone || isSinker || Math.random() < 0.60;
      if (chopEligible) {
        const bounceFt = Math.round(28 + (equipmentBuffs.chopBounceBonus ? equipmentBuffs.chopBounceBonus * 0.3 : 0) + Math.random() * 12);
        return {
          outcome: 'INFIELD_SINGLE_CHOP',
          description: `💥 THE BALTIMORE CHOP! Violent downward strike off home plate dirt! The ball caroms ${bounceFt} feet into the sky over the third baseman's leap—batter beats the throw to first easily!`,
          hitData: {
            exitVelocity: 88 + Math.round(Math.random() * 6),
            launchAngle: -16,
            distance: 44,
            bounceHeight: bounceFt
          },
          isBaltimoreChop: true,
          hapticPattern: 'CHOP',
          streakMaintained: true,
          scoreDelta: 0,
          dynamicHint: '🎯 Dynamic Clue: Pitcher visibly rattled after the Chop. Next pitch break reduced by 25%.'
        };
      }
    }

    // 2. Guess matching bonuses
    const isTypeMatch = counter.guessType === pitch.type;
    const isZoneMatch = counter.guessZone === pitch.zone;

    let guessBonus = 0;
    if (isTypeMatch && isZoneMatch) {
      guessBonus = 48; // Barreled dead red in chosen quadrant!
    } else if (isTypeMatch) {
      guessBonus = 24; // Sat on the right pitch type
    } else if (isZoneMatch) {
      guessBonus = 16; // Hunted the right location
    } else {
      guessBonus = -16; // Fooled by speed & break
    }

    // Special Skills
    if (counter.specialSkill === 'SIT_DEAD_RED' && pitch.type === '4-SEAM') {
      guessBonus += 25;
    } else if (counter.specialSkill === 'CONTACT_PROTECT') {
      guessBonus += 15;
    } else if (counter.specialSkill === 'OPPO_FIELD_TAKE' && (pitch.zone.includes('OUT') || pitch.zone.includes('AWAY'))) {
      guessBonus += 20;
    }

    // 3. Stat Ratings & Equipment
    const netContact = batter.stats.contact + (equipmentBuffs.contactBonus || 0);
    const netPower = batter.stats.power + (equipmentBuffs.powerBonus || 0);
    const pitcherStuff = pitcher.stats.stuff ?? 60;
    const pitcherControl = pitcher.stats.control ?? 60;

    const skillMargin = (netContact * 0.42) + (netPower * 0.32) - (pitcherStuff * 0.38) - (pitcherControl * 0.20);
    const roll = skillMargin + guessBonus + (Math.random() * 32 - 16);

    // 4. Outcome distribution
    if (roll >= 74) {
      const distance = Math.round(390 + (netPower * 0.6) + Math.random() * 35);
      return {
        outcome: 'HOME_RUN',
        description: `🚀 CRACK! BARRELED UP! Deep drive towering into the right-center bleachers (${distance} ft)! Absolutely crushed!`,
        hitData: { exitVelocity: 104 + Math.round(Math.random() * 8), launchAngle: 28, distance },
        isBaltimoreChop: false,
        hapticPattern: 'HEAVY',
        streakMaintained: true,
        scoreDelta: 1,
        dynamicHint: '🔥 On Fire: Batter has locked in. Next pitch release point exposed!'
      };
    }

    if (roll >= 58) {
      return {
        outcome: 'DOUBLE',
        description: '⚡ Ripped into the right-field alley! Rolls all the way to the warning track for a stand-up double!',
        hitData: { exitVelocity: 97, launchAngle: 18, distance: 335 },
        isBaltimoreChop: false,
        hapticPattern: 'SNAP',
        streakMaintained: true,
        scoreDelta: 0
      };
    }

    if (roll >= 40) {
      return {
        outcome: 'SINGLE',
        description: 'Clean line-drive rope through the 5.5 hole into left field! Base hit!',
        hitData: { exitVelocity: 91, launchAngle: 12, distance: 230 },
        isBaltimoreChop: false,
        hapticPattern: 'LIGHT',
        streakMaintained: true,
        scoreDelta: 0
      };
    }

    if (roll >= 22) {
      const isGrounder = Math.random() > 0.45;
      return {
        outcome: isGrounder ? 'GROUNDOUT' : 'FLYOUT',
        description: isGrounder 
          ? 'Chopped weakly to the second baseman, who scoops and fires to first in time for the out.'
          : 'High fly ball caught comfortably on the warning track by the center fielder.',
        hitData: { exitVelocity: 76, launchAngle: isGrounder ? 4 : 48, distance: 190 },
        isBaltimoreChop: false,
        hapticPattern: 'LIGHT',
        streakMaintained: false,
        scoreDelta: 0
      };
    }

    // Strikeout / Whiff
    return {
      outcome: 'STRIKEOUT',
      description: `💨 Fooled completely! Swung right through the ${pitch.type} (${pitch.velocity} MPH). Strike three, batter is down on strikes!`,
      isBaltimoreChop: false,
      hapticPattern: 'SNAP',
      streakMaintained: false,
      scoreDelta: 0
    };
  }

  /**
   * Advances base runners upon a hit or walk.
   */
  public static advanceRunners(
    runners: [boolean, boolean, boolean],
    bases: number
  ): { nextRunners: [boolean, boolean, boolean]; runsScored: number } {
    let runsScored = 0;
    const current = [...runners] as [boolean, boolean, boolean];

    if (bases >= 4) {
      // Home run: clear all runners and count batter
      runsScored = current.filter(Boolean).length + 1;
      return { nextRunners: [false, false, false], runsScored };
    }

    // Push base runners forward
    for (let b = 0; b < bases; b++) {
      if (current[2]) runsScored++;
      current[2] = current[1];
      current[1] = current[0];
      current[0] = (b === 0);
    }

    return { nextRunners: current, runsScored };
  }
}
