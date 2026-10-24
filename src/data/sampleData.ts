// ============================================================
// SAMPLE DATA -- "THE LAST SIGNAL"
//
// This is your pre-loaded demo project so you can immediately
// test all the features of StoryVerse AI without typing anything.
//
// A sci-fi mystery set on a derelict space station.
// ============================================================

import type { StoryProject, Character, Scene, StoryFork } from '../types';

// --- The Demo Project ---
export const DEMO_PROJECT: StoryProject = {
  id: 'demo-001',
  title: 'The Last Signal',
  genre: 'Sci-Fi / Mystery',
  plotSummary:
    'In 2187, Commander Yara Osei receives a distress signal from the Erebus Station -- ' +
    'a deep-space research outpost thought destroyed five years ago. She leads a small crew ' +
    'to investigate, only to discover the station is very much alive... and so is someone who ' +
    'should have been dead. As dark secrets of a forbidden AI experiment surface, Yara must ' +
    'decide how far she will go to protect her crew -- and what it truly means to be human.',
  manuscript:
    'CHAPTER ONE -- DEAD AIR\n\n' +
    'The signal arrived at 03:14 ship time, cutting through seventeen light-minutes of static like a blade through silk.\n\n' +
    "Yara Osei was already awake. She'd stopped sleeping properly three weeks into the mission -- somewhere between the Kepler Belt and the silence that followed it. She sat at the comms console in her thermal suit, coffee cooling at her elbow, staring at star charts she had long since memorised.\n\n" +
    'The ping made her hand freeze.\n\n' +
    "She replayed it twice before she let herself believe it.\n\n" +
    '"Erebus Station. This is Erebus Station calling any vessel in range. Please respond. We are--"\n\n' +
    'Static. Then nothing.\n\n' +
    'Five years of nothing, and now this.\n\n' +
    "She pulled up the station's last known coordinates, cross-referenced with their current heading. Fourteen hours away at half-burn. She could change course without waking the others. She could pretend she'd never heard it.\n\n" +
    'Yara reached for the intercom.\n\n' +
    '"Marcus. Priya. Get to the bridge."\n\n\n' +
    'CHAPTER TWO -- WRECKAGE\n\n' +
    'The Erebus grew in their viewport like a scar healing badly -- jagged, asymmetric, one whole docking arm sheared clean away. But lights still burned in the aft section. Dim, amber, almost biological.\n\n' +
    '"That\'s not possible," Priya said, her tablet frozen in her hands. "The Commission showed us the debris field. They showed us--"\n\n' +
    '"Someone lied," Marcus said simply. He had the flat delivery of a man who had stopped being surprised by human nature.\n\n' +
    "Yara matched their approach vector to the station's lazy rotation, jaw tight. \"Suits on. We dock in twenty minutes.\"\n\n" +
    "She didn't tell them about the second signal. The one sent on a frequency only she was supposed to know.\n\n" +
    'The one that said: *Yara. It\'s me. I\'m still here.*',
  createdAt: new Date('2024-03-10'),
  updatedAt: new Date('2024-06-22'),
  coverColor: 'from-indigo-900 via-violet-900 to-slate-900',
  wordCount: 312,
  status: 'in-progress',
};

// --- The Characters ---
export const DEMO_CHARACTERS: Character[] = [
  {
    id: 'char-001',
    storyId: 'demo-001',
    name: 'Commander Yara Osei',
    role: 'protagonist',
    age: 38,
    appearance:
      'Tall and lean with deep brown skin, close-cropped natural hair greying at the temples. ' +
      'Dark eyes that give away nothing. A small scar bisects her left eyebrow -- she never explains it.',
    personality:
      'Methodical, guarded, fiercely loyal to her crew but emotionally closed off. ' +
      'She leads by example rather than inspiration. Quietly haunted by a decision she made on her last mission.',
    backstory:
      'Decorated combat pilot turned deep-space investigator for the Interstellar Commission. ' +
      'She was part of the original Erebus project review board five years ago -- ' +
      'which is why she alone knows the signal frequency.',
    motivation:
      'To uncover the truth about Erebus without losing anyone else. ' +
      'And to answer the question she has been running from: who sent that second signal.',
    quirks:
      "Counts ceiling tiles when stressed. Never apologises -- fixes things instead. " +
      "Has a habit of replaying conversations in her head long after they're over.",
    avatarColor: 'from-indigo-700 to-violet-800',
    avatarInitials: 'YO',
  },
  {
    id: 'char-002',
    storyId: 'demo-001',
    name: 'Dr. Marcus Vael',
    role: 'supporting',
    age: 44,
    appearance:
      'Heavyset, pale, with the permanently rumpled look of a man who sleeps in his clothes. ' +
      'Thick silver-streaked beard. Hands always moving -- sketching diagrams in air, tapping rhythms on surfaces.',
    personality:
      "Irreverent, dry-humoured, ruthlessly pragmatic. The kind of person who asks the uncomfortable question " +
      "everyone else is thinking but won't voice. Deeply moral beneath the cynical exterior.",
    backstory:
      'Former Commission engineer who was quietly forced out after raising ethics concerns about the Erebus AI programme. ' +
      'Yara specifically requested him for this mission -- she trusts his instincts more than his reputation.',
    motivation:
      'Prove he was right about Erebus. And, quietly, atone for the parts of the project he did participate in.',
    quirks:
      'Whistles tunelessly under pressure. Argues with every decision, then executes it perfectly. ' +
      'Never uses the word "impossible" -- says "not yet solved" instead.',
    avatarColor: 'from-slate-600 to-slate-800',
    avatarInitials: 'MV',
  },
  {
    id: 'char-003',
    storyId: 'demo-001',
    name: 'Priya Nair',
    role: 'supporting',
    age: 26,
    appearance:
      'Small-framed, quick-moving, with warm brown skin and a cascade of dark hair usually pinned up haphazardly. ' +
      'Expressive eyes that broadcast everything she tries to conceal.',
    personality:
      'Brilliant, idealistic, and terrified of it. She is the most technically gifted member of the crew ' +
      'and the least experienced with how the world actually works. Wears her emotions openly -- a liability in space.',
    backstory:
      "Graduated top of her class from the Titan Institute at 23. The Erebus mission is her first deep-space assignment. " +
      "She doesn't know yet that she was chosen partly because she has no history with the original project.",
    motivation:
      "Make something that matters. Prove that discovery doesn't have to be dangerous.",
    quirks:
      "Talks to her equipment. Stress-eats protein bars but acts like she isn't. " +
      'Can solve complex equations in her head but forgets to charge her tablet.',
    avatarColor: 'from-rose-700 to-pink-800',
    avatarInitials: 'PN',
  },
];

// --- The Sample Scene ---
export const DEMO_SCENE: Scene = {
  id: 'scene-001',
  storyId: 'demo-001',
  title: 'First Contact -- The Airlock',
  setting: 'Erebus Station -- Main Airlock, Docking Level Alpha. Emergency lighting only. The air smells of recycled cold and something burnt.',
  description:
    'The crew has just breached the airlock and discovered the station is not as empty as the Commission claimed. ' +
    'Tension is high. They have encountered an unexpected presence.',
  createdAt: new Date('2024-06-22'),
  lines: [
    {
      id: 'line-001',
      characterId: 'char-001',
      characterName: 'Commander Yara Osei',
      action: '(hand on sidearm, scanning the corridor)',
      dialogue: 'Station manifest said this section was sealed after the incident. Two layers of bulkhead. Mag-locked.',
      emotion: 'controlled tension',
    },
    {
      id: 'line-002',
      characterId: 'char-002',
      characterName: 'Dr. Marcus Vael',
      action: '(crouching beside a manual override panel, traces the wiring)',
      dialogue: 'Someone overrode it from the inside. Recently -- look at the heat signature on these relays. Twelve, maybe fourteen hours ago.',
      emotion: 'analytical curiosity',
    },
    {
      id: 'line-003',
      characterId: 'char-003',
      characterName: 'Priya Nair',
      action: '(whispers, tablet clutched to chest)',
      dialogue: "That's... that's impossible. The station's been dead for five years. There's no life support for the forward sections -- the logs show--",
      emotion: 'frightened disbelief',
    },
    {
      id: 'line-004',
      characterId: 'char-002',
      characterName: 'Dr. Marcus Vael',
      dialogue: 'Not impossible. Not yet solved.',
      emotion: 'dry, deliberate',
    },
    {
      id: 'line-005',
      characterId: 'char-001',
      characterName: 'Commander Yara Osei',
      action: '(holds up a fist -- the crew freezes)',
      dialogue: "...Someone's in the next corridor. Move.",
      emotion: 'commanding',
    },
  ],
};

// --- Alternate Story Paths ---
export const DEMO_FORK: StoryFork = {
  id: 'fork-001',
  storyId: 'demo-001',
  branchPoint: 'Chapter 2 -- "Yara hears the second signal"',
  originalPath:
    'Yara tells her crew about the second signal and they proceed to the station together, ' +
    'united but deeply unsettled.',
  alternatives: [
    {
      id: 'alt-001',
      label: 'What if Yara goes alone?',
      description:
        'Instead of waking her crew, Yara slips away in the shuttle pod alone -- telling no one. ' +
        'She needs to face whoever sent that signal before she decides whether her crew is safe.',
      outcome:
        'Creates a tense solo infiltration arc. Yara is more vulnerable but has complete control of information. ' +
        "Marcus and Priya discover she's gone and must decide whether to follow or wait -- " +
        'fracturing team trust before the story really begins.',
      tone: 'dark',
    },
    {
      id: 'alt-002',
      label: 'What if Yara reports to the Commission first?',
      description:
        'Yara transmits the signal to Commission HQ and awaits orders, playing by the book for once. ' +
        'They order her to stand down and a Commission vessel is en route.',
      outcome:
        'The story becomes a race against bureaucracy. Yara must investigate before the Commission arrives ' +
        'and erases whatever is there. Shifts genre toward thriller / conspiracy. ' +
        "Marcus's backstory with the Commission becomes immediately relevant.",
      tone: 'neutral',
    },
    {
      id: 'alt-003',
      label: 'What if the signal is a trap and Yara knows it?',
      description:
        "Yara recognises a subtle authentication error in the signal -- it's been spoofed using stolen credentials. " +
        'Someone wants her specifically to come to Erebus. She tells her crew the truth upfront.',
      outcome:
        "Team dynamic shifts entirely -- they're now walking into an ambush they've chosen. " +
        'Adds a cat-and-mouse layer. Priya becomes crucial: the forger may have left technical fingerprints ' +
        'she can trace. Darker, more paranoid tone throughout.',
      tone: 'dark',
    },
    {
      id: 'alt-004',
      label: 'What if Priya intercepts the second signal first?',
      description:
        'A monitoring algorithm Priya set up for her own research captures the private signal before Yara can conceal it. ' +
        "Priya now knows a secret she wasn't meant to, and Yara knows she knows.",
      outcome:
        'Creates an interpersonal tension subplot from the very start. Priya must decide whether to confront Yara ' +
        'or protect her. Fundamentally changes who has narrative power in the crew. ' +
        'Could become the engine of a much more character-driven story.',
      tone: 'hopeful',
    },
  ],
  createdAt: new Date('2024-06-22'),
};

// --- All sample projects for the dashboard ---
export const SAMPLE_PROJECTS: StoryProject[] = [
  DEMO_PROJECT,
  {
    id: 'sample-002',
    title: "The Cartographer's Daughter",
    genre: 'Historical Fantasy',
    plotSummary:
      "In 1842 Vienna, Emilie Hartmann inherits her father's secret maps -- charts that don't show geography, " +
      'but futures. When the wrong people discover the maps exist, she must flee across a Europe on the edge of revolution.',
    manuscript: '',
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-15'),
    coverColor: 'from-amber-900 via-orange-900 to-red-900',
    wordCount: 0,
    status: 'draft',
  },
  {
    id: 'sample-003',
    title: 'Thirty Seconds of Silence',
    genre: 'Contemporary Drama',
    plotSummary:
      'Three strangers are trapped in a lift between floors of a Tokyo skyscraper. ' +
      "Over the next six hours, they'll confess things they've never said aloud.",
    manuscript: '',
    createdAt: new Date('2024-04-18'),
    updatedAt: new Date('2024-04-18'),
    coverColor: 'from-teal-900 via-cyan-900 to-sky-900',
    wordCount: 0,
    status: 'draft',
  },
];
