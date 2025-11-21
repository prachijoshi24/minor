// client/src/data/assessmentData.js
const questions = [
    { id: 1, text: "Over the past month, how often have you felt strong fear or anxiety about a specific object or situation (e.g., spiders, heights, needles)?", category: "specific" },
    { id: 2, text: "How much do concerns about being judged or embarrassed in front of others bother you?", category: "social" },
    { id: 3, text: "How often do you experience sudden intense fear or panic (heart racing, breathless) without an obvious trigger?", category: "panic" },
    { id: 4, text: "How much do you avoid places because you worry you might panic or feel trapped (crowded places, public transport)?", category: "agoraphobia" },
    { id: 5, text: "When you think about the feared object/situation, how intense are your physical symptoms (shaking, sweating)?", category: "phys_symptoms" },
    { id: 6, text: "How much does this fear reduce your daily activities, work, or social life?", category: "functional_impairment" },
    { id: 7, text: "How distressed are you when you imagine being exposed to the feared object/situation?", category: "distress" },
    { id: 8, text: "How often do you use avoidance behaviors (skipping events, changing routes) because of fear?", category: "avoidance" },
    { id: 9, text: "How much do safety behaviors (carrying certain items, having a friend nearby) reduce your anxiety?", category: "safety_behaviors" },
    { id: 10, text: "Overall, how severe would you rate this fear on a 0–10 scale (0 = no problem, 10 = extremely severe)?", category: "overall_severity" },
  
    { id: 11, text: "Describe the fear or situation that bothers you most (short).", category: "open_description", open: true },
    { id: 12, text: "When was the first time you remember feeling this fear? (short)", category: "open_onset", open: true },
    { id: 13, text: "What's the one goal you'd like to reach in therapy regarding this fear?", category: "open_goal", open: true },
  ];
  
  export default questions;