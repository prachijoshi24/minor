// src/constants/assessmentTypes.js
export const SPIN_QUESTIONS = [
  "Being embarrassed is so awkward to me that I avoid situations where I might be embarrassed",
  "I avoid activities in which I am the center of attention",
  "Being criticized scares me a lot",
  "I avoid talking to people I don't know",
  "I avoid parties",
  "Talking to strangers scares me",
  "I avoid having to give speeches",
  "I would do anything to avoid being criticized",
  "Heart pounding, sweating, or shaking when facing a feared situation",
  "Avoiding social situations because of fear of embarrassment",
  "Avoiding activities that involve being the center of attention",
  "Being afraid of people in authority",
  "Being afraid of being embarrassed or humiliated",
  "Sweating a lot or having a racing heart in social situations",
  "Avoiding speaking to anyone because of fear of embarrassment"
];

export const BAI_QUESTIONS = [
  "Numbness or tingling",
  "Feeling hot",
  "Wobbliness in legs",
  "Unable to relax",
  "Fear of worst happening",
  "Dizzy or lightheaded",
  "Heart pounding/racing",
  "Unsteady",
  "Terrified or afraid",
  "Nervous",
  "Feeling of choking",
  "Hands trembling",
  "Shaky / unsteady",
  "Fear of losing control",
  "Difficulty breathing",
  "Fear of dying",
  "Scared",
  "Indigestion",
  "Faint / lightheaded",
  "Face flushed",
  "Hot/cold sweats"
];

export const FSS_CATEGORIES = [
  {
    name: "Animals",
    items: ["Spiders", "Snakes", "Dogs", "Insects", "Bats", "Rats/Mice", "Birds"]
  },
  {
    name: "Situations",
    items: ["Flying", "Heights", "Enclosed spaces", "Tunnels", "Bridges", "Driving", "Public transportation"]
  },
  {
    name: "Social",
    items: ["Public speaking", "Meeting new people", "Being watched", "Eating in public"]
  }
];

export const calculateSPINScore = (answers) => {
  const values = Object.values(answers).map(Number);
  return values.reduce((sum, value) => sum + value, 0);
};

export const calculateBAIScore = (answers) => {
  const values = Object.values(answers).map(Number);
  return values.reduce((sum, value) => sum + value, 0);
};

export const calculateFSSScore = (answers) => {
  const values = Object.values(answers).map(Number);
  return values.reduce((sum, value) => sum + value, 0);
};

export const ASSESSMENT_TYPES = {
  SPIN: {
    name: 'Social Phobia Inventory',
    description: 'Measures social anxiety symptoms',
    questions: SPIN_QUESTIONS,
    calculateScore: calculateSPINScore,
    maxScore: SPIN_QUESTIONS.length * 4,
    scoring: {
      ranges: [
        { max: 20, label: 'Mild or no social anxiety' },
        { max: 30, label: 'Moderate social anxiety' },
        { max: 40, label: 'Severe social anxiety' },
        { max: 68, label: 'Very severe social anxiety' }
      ]
    }
  },
  BAI: {
    name: 'Beck Anxiety Inventory',
    description: 'Measures anxiety symptoms',
    questions: BAI_QUESTIONS,
    calculateScore: calculateBAIScore,
    maxScore: BAI_QUESTIONS.length * 3,
    scoring: {
      ranges: [
        { max: 21, label: 'Low anxiety' },
        { max: 35, label: 'Moderate anxiety' },
        { max: 63, label: 'Potentially concerning anxiety' }
      ]
    }
  },
  FSS: {
    name: 'Fear Survey Schedule',
    description: 'Measures specific fears and phobias',
    questions: FSS_CATEGORIES.flatMap(category => category.items),
    calculateScore: calculateFSSScore,
    maxScore: FSS_CATEGORIES.reduce((sum, cat) => sum + cat.items.length, 0) * 4,
    scoring: {
      ranges: [
        { max: 100, label: 'Low fear levels' },
        { max: 200, label: 'Moderate fear levels' },
        { max: 400, label: 'High fear levels' }
      ]
    }
  }
};

export const STORAGE_KEY = "cbt_assessments";