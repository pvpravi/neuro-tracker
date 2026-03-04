// Domain explanations for parents to understand assessment scores

export const DOMAIN_EXPLANATIONS = {
  patternLogicScore: {
    name: "Pattern & Logic Affinity",
    description: "This measures your child's ability to recognize patterns, solve puzzles, and understand cause-and-effect relationships.",
    lowScore: "Your child may benefit from activities that introduce simple patterns and sequences in a playful, low-pressure way. Think of matching games, sorting by color or shape, and predictable routines.",
    mediumScore: "Your child shows developing pattern recognition skills. Continue to support this through age-appropriate puzzles, building activities, and exploring how things work together.",
    highScore: "Your child demonstrates strong pattern recognition and logical thinking! They may enjoy complex puzzles, building projects, coding activities, or exploring systems and how things work.",
    parentTips: [
      "Use visual schedules to help your child predict what comes next",
      "Play matching and sorting games together",
      "Explore cause-and-effect toys and activities",
      "Celebrate their problem-solving attempts, not just successes"
    ]
  },
  spatialConstructiveScore: {
    name: "Spatial & Constructive Thinking",
    description: "This reflects your child's ability to understand space, build structures, and visualize how objects fit together.",
    lowScore: "Your child may need extra support with spatial tasks. Start with simple building activities, shape sorters, and activities that help them understand spatial concepts like 'in,' 'on,' 'under,' and 'beside.'",
    mediumScore: "Your child is developing spatial awareness. Encourage building with blocks, completing puzzles, and exploring their environment through movement and play.",
    highScore: "Your child has excellent spatial reasoning! They may thrive with LEGO, construction toys, art projects, maps, and activities that involve design and building.",
    parentTips: [
      "Provide building materials like blocks, LEGO, or magnetic tiles",
      "Do puzzles together, starting simple and gradually increasing complexity",
      "Use spatial language: 'Put the toy under the table,' 'Stack them on top'",
      "Encourage drawing, painting, and creative construction"
    ]
  },
  sensoryRegulationScore: {
    name: "Sensory Regulation",
    description: "This measures how your child processes and responds to sensory input like sounds, textures, lights, and movement.",
    lowScore: "Your child may experience sensory overwhelm more easily. Creating a sensory-friendly environment with quiet spaces, comfortable clothing, and predictable routines can help them feel safe and regulated.",
    mediumScore: "Your child is learning to manage sensory experiences. Support them by respecting their sensory preferences, offering breaks when needed, and teaching self-regulation strategies.",
    highScore: "Your child demonstrates good sensory regulation! They can adapt to various environments and use strategies to stay comfortable. Continue to honor their sensory needs and preferences.",
    parentTips: [
      "Create a calm-down corner with soft lighting and comfort items",
      "Respect their sensory preferences (clothing tags, food textures, noise levels)",
      "Give advance warning before loud or busy activities",
      "Teach them to recognize when they need a sensory break",
      "Use noise-canceling headphones, fidget tools, or weighted items if helpful"
    ]
  },
  repetitiveComfortScore: {
    name: "Repetitive Comfort Behaviors",
    description: "This reflects your child's use of routines, special interests, and repetitive behaviors for comfort and regulation.",
    lowScore: "Your child may be very flexible with routines and activities. While this is wonderful, some children benefit from having a few predictable routines to provide structure and security.",
    mediumScore: "Your child uses some routines and preferred activities for comfort. This is healthy! Support their interests while gently introducing variety when they're ready.",
    highScore: "Your child finds great comfort in routines, special interests, and familiar patterns. These are strengths! They provide regulation and joy. Honor these while gradually building flexibility.",
    parentTips: [
      "Respect and celebrate their special interests - they're a source of joy and expertise",
      "Use visual schedules to make routines predictable",
      "Give advance notice before changes to routines",
      "Allow time for their preferred activities as part of daily routine",
      "Connect with them through their interests"
    ]
  },
  taskPersistenceScore: {
    name: "Task Persistence",
    description: "This measures your child's ability to stay engaged with activities and complete tasks, even when challenging.",
    lowScore: "Your child may need support to stay engaged with tasks. Break activities into smaller steps, provide frequent encouragement, and celebrate small wins along the way.",
    mediumScore: "Your child is developing persistence skills. Continue to support them with clear expectations, manageable task lengths, and positive reinforcement for effort.",
    highScore: "Your child shows excellent persistence! They can stay focused and work through challenges. Continue to provide appropriately challenging activities that match their interests.",
    parentTips: [
      "Break larger tasks into smaller, achievable steps",
      "Use timers to make work periods predictable",
      "Celebrate effort and progress, not just completion",
      "Alternate challenging tasks with preferred activities",
      "Provide clear visual or written instructions"
    ]
  },
  verbalExpressiveScore: {
    name: "Verbal & Expressive Communication",
    description: "This reflects your child's ability to express their thoughts, needs, and feelings through words, gestures, or alternative communication.",
    lowScore: "Your child may be developing their communication skills. Support them with visual aids, gestures, AAC devices if appropriate, and by giving them time to express themselves without pressure.",
    mediumScore: "Your child is building their communication abilities. Continue to model language, respond to all communication attempts, and provide opportunities for expression.",
    highScore: "Your child communicates effectively! They can express their needs and thoughts clearly. Continue to support their communication development and honor all forms of expression.",
    parentTips: [
      "Respond to all communication attempts, whether verbal or non-verbal",
      "Give them time to process and respond - don't rush",
      "Use visual supports like picture cards or communication boards if helpful",
      "Model the language you want them to use",
      "Celebrate all forms of communication, not just speech"
    ]
  },
  transitionAdaptabilityScore: {
    name: "Transition & Adaptability",
    description: "This measures how your child handles changes in routine, transitions between activities, and unexpected situations.",
    lowScore: "Your child may find transitions challenging. Use visual schedules, timers, and advance warnings to help them prepare for changes. Consistency and predictability are key.",
    mediumScore: "Your child is learning to manage transitions. Continue to provide support through visual cues, warnings, and transition strategies that work for your family.",
    highScore: "Your child handles transitions well! They can adapt to changes with support. Continue to respect their need for preparation and maintain helpful transition routines.",
    parentTips: [
      "Use visual schedules to show what's coming next",
      "Give 5-minute and 2-minute warnings before transitions",
      "Use timers to make transitions predictable",
      "Create transition rituals (songs, countdowns, special objects)",
      "Allow extra time for transitions - don't rush"
    ]
  },
  fineMotorScore: {
    name: "Fine Motor & Structured Engagement",
    description: "This reflects your child's ability to use their hands for detailed tasks like writing, drawing, buttoning, and manipulating small objects.",
    lowScore: "Your child may need support with fine motor tasks. Provide opportunities for hand strengthening through play (playdough, squeezing, tearing paper) and offer adaptive tools when needed.",
    mediumScore: "Your child is developing fine motor skills. Continue to provide practice through fun activities like crafts, building, and self-care tasks with support.",
    highScore: "Your child has strong fine motor skills! They can manage detailed tasks independently. Continue to provide opportunities for creative and precise hand activities.",
    parentTips: [
      "Offer playdough, clay, or putty for hand strengthening",
      "Practice with child-safe scissors, crayons, and markers",
      "Use adaptive grips or tools if helpful",
      "Make fine motor practice fun through crafts and games",
      "Celebrate progress in self-care tasks (buttoning, zipping, tying)"
    ]
  }
};

export function getScoreInterpretation(score: number): 'low' | 'medium' | 'high' {
  if (score < 4) return 'low';
  if (score < 7) return 'medium';
  return 'high';
}

export function getDomainExplanation(domainKey: string, score: number) {
  const domain = DOMAIN_EXPLANATIONS[domainKey as keyof typeof DOMAIN_EXPLANATIONS];
  if (!domain) return null;

  const interpretation = getScoreInterpretation(score);
  const scoreText = interpretation === 'low' ? domain.lowScore : 
                    interpretation === 'medium' ? domain.mediumScore : 
                    domain.highScore;

  return {
    name: domain.name,
    description: domain.description,
    scoreInterpretation: scoreText,
    parentTips: domain.parentTips,
    score: score.toFixed(1)
  };
}
