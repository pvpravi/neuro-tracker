// Define the structure so TypeScript is happy
export type Question = {
  id: number;
  domain: string;
  text: string;
};

// The 8 locked domains
export const DOMAINS = {
  PATTERN_LOGIC: "patternLogicScore",
  SPATIAL_CONSTRUCTIVE: "spatialConstructiveScore",
  SENSORY_REGULATION: "sensoryRegulationScore",
  REPETITIVE_COMFORT: "repetitiveComfortScore",
  TASK_PERSISTENCE: "taskPersistenceScore",
  VERBAL_EXPRESSIVE: "verbalExpressiveScore",
  TRANSITION_ADAPTABILITY: "transitionAdaptabilityScore",
  FINE_MOTOR: "fineMotorScore",
} as const;

// Branch the questions by developmental age
// Each age group has 40 questions (5 per domain × 8 domains)
// Scoring: 0-4 scale per question, max 20 per domain, normalized to 0-10
export const assessmentQuestionsByAge: Record<string, Question[]> = {
  "0-3": [
    // Domain 1: Pattern & Logic Affinity (5 questions)
    { id: 1, domain: DOMAINS.PATTERN_LOGIC, text: "Does the child show interest in sorting objects by color, shape, or size?" },
    { id: 2, domain: DOMAINS.PATTERN_LOGIC, text: "Can the child complete simple shape-sorting puzzles (3-5 pieces)?" },
    { id: 3, domain: DOMAINS.PATTERN_LOGIC, text: "Does the child notice and point out patterns in their environment (e.g., stripes, dots)?" },
    { id: 4, domain: DOMAINS.PATTERN_LOGIC, text: "Can the child match identical objects or pictures?" },
    { id: 5, domain: DOMAINS.PATTERN_LOGIC, text: "Does the child show fascination with cause-and-effect toys (buttons, levers)?" },

    // Domain 2: Spatial & Constructive Thinking (5 questions)
    { id: 6, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Can the child stack 3 or more blocks without them falling?" },
    { id: 7, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Does the child enjoy building with blocks or nesting cups?" },
    { id: 8, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Can the child fit shapes into corresponding holes in a shape sorter?" },
    { id: 9, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Does the child show spatial awareness when navigating around furniture?" },
    { id: 10, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Can the child complete simple 3-4 piece jigsaw puzzles?" },

    // Domain 3: Sensory Regulation (5 questions)
    { id: 11, domain: DOMAINS.SENSORY_REGULATION, text: "Does the child become distressed by loud noises (vacuum, blender)?" },
    { id: 12, domain: DOMAINS.SENSORY_REGULATION, text: "Can the child tolerate different clothing textures without distress?" },
    { id: 13, domain: DOMAINS.SENSORY_REGULATION, text: "Does the child seek or avoid certain sensory experiences (spinning, swinging)?" },
    { id: 14, domain: DOMAINS.SENSORY_REGULATION, text: "Can the child self-soothe when overwhelmed (seeking comfort items, quiet space)?" },
    { id: 15, domain: DOMAINS.SENSORY_REGULATION, text: "Does the child tolerate messy play (finger painting, sand, water)?" },

    // Domain 4: Repetitive Comfort Behavior (5 questions)
    { id: 16, domain: DOMAINS.REPETITIVE_COMFORT, text: "Does the child engage in repetitive movements (hand flapping, rocking) when excited or stressed?" },
    { id: 17, domain: DOMAINS.REPETITIVE_COMFORT, text: "Does the child line up toys or objects in specific patterns?" },
    { id: 18, domain: DOMAINS.REPETITIVE_COMFORT, text: "Does the child have strong preferences for specific routines (bedtime, mealtime)?" },
    { id: 19, domain: DOMAINS.REPETITIVE_COMFORT, text: "Does the child watch the same video or read the same book repeatedly?" },
    { id: 20, domain: DOMAINS.REPETITIVE_COMFORT, text: "Does the child show intense focus on spinning objects or moving parts?" },

    // Domain 5: Task Persistence (5 questions)
    { id: 21, domain: DOMAINS.TASK_PERSISTENCE, text: "Can the child stay engaged with a toy or activity for 5+ minutes?" },
    { id: 22, domain: DOMAINS.TASK_PERSISTENCE, text: "Does the child persist when a task is challenging (e.g., trying to open a container)?" },
    { id: 23, domain: DOMAINS.TASK_PERSISTENCE, text: "Can the child complete simple tasks with minimal adult support?" },
    { id: 24, domain: DOMAINS.TASK_PERSISTENCE, text: "Does the child return to an activity after being interrupted?" },
    { id: 25, domain: DOMAINS.TASK_PERSISTENCE, text: "Can the child follow through on simple requests (e.g., 'bring me the ball')?" },

    // Domain 6: Verbal & Expressive Communication (5 questions)
    { id: 26, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Does the child use gestures (pointing, waving) to communicate needs?" },
    { id: 27, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Can the child say 10+ recognizable words or word approximations?" },
    { id: 28, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Does the child attempt to imitate sounds or words?" },
    { id: 29, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Can the child make their needs known (verbally or non-verbally)?" },
    { id: 30, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Does the child respond to their name being called?" },

    // Domain 7: Transition & Adaptability (5 questions)
    { id: 31, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Can the child transition between activities without significant distress?" },
    { id: 32, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Does the child adapt to changes in routine (new caregiver, different location)?" },
    { id: 33, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Can the child handle unexpected changes (e.g., favorite toy not available)?" },
    { id: 34, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Does the child need advance warning before transitions?" },
    { id: 35, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Can the child calm down after a transition with support?" },

    // Domain 8: Fine Motor & Structured Engagement (5 questions)
    { id: 36, domain: DOMAINS.FINE_MOTOR, text: "Can the child pick up small objects using thumb and finger (pincer grasp)?" },
    { id: 37, domain: DOMAINS.FINE_MOTOR, text: "Does the child attempt to use utensils (spoon, fork) during meals?" },
    { id: 38, domain: DOMAINS.FINE_MOTOR, text: "Can the child scribble with crayons or markers?" },
    { id: 39, domain: DOMAINS.FINE_MOTOR, text: "Does the child turn pages in a book (even if multiple at once)?" },
    { id: 40, domain: DOMAINS.FINE_MOTOR, text: "Can the child participate in simple finger plays or hand movements?" },
  ],

  "4-7": [
    // Domain 1: Pattern & Logic Affinity (5 questions)
    { id: 1, domain: DOMAINS.PATTERN_LOGIC, text: "Can the child complete puzzles with 12+ pieces independently?" },
    { id: 2, domain: DOMAINS.PATTERN_LOGIC, text: "Does the child recognize and create simple patterns (AB, ABC)?" },
    { id: 3, domain: DOMAINS.PATTERN_LOGIC, text: "Can the child sort objects by multiple attributes (color AND shape)?" },
    { id: 4, domain: DOMAINS.PATTERN_LOGIC, text: "Does the child show interest in how things work (taking apart toys, asking 'why')?" },
    { id: 5, domain: DOMAINS.PATTERN_LOGIC, text: "Can the child follow multi-step sequences (morning routine, recipe steps)?" },

    // Domain 2: Spatial & Constructive Thinking (5 questions)
    { id: 6, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Can the child build complex structures with blocks or LEGO?" },
    { id: 7, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Does the child understand spatial concepts (under, over, beside, between)?" },
    { id: 8, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Can the child draw recognizable shapes (circle, square, triangle)?" },
    { id: 9, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Does the child enjoy construction toys and building activities?" },
    { id: 10, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Can the child navigate familiar spaces independently?" },

    // Domain 3: Sensory Regulation (5 questions)
    { id: 11, domain: DOMAINS.SENSORY_REGULATION, text: "Can the child tolerate typical classroom noise levels?" },
    { id: 12, domain: DOMAINS.SENSORY_REGULATION, text: "Does the child manage transitions between different sensory environments?" },
    { id: 13, domain: DOMAINS.SENSORY_REGULATION, text: "Can the child identify when they need a sensory break?" },
    { id: 14, domain: DOMAINS.SENSORY_REGULATION, text: "Does the child use strategies to self-regulate (deep breaths, fidget tools)?" },
    { id: 15, domain: DOMAINS.SENSORY_REGULATION, text: "Can the child participate in group activities despite sensory input?" },

    // Domain 4: Repetitive Comfort Behavior (5 questions)
    { id: 16, domain: DOMAINS.REPETITIVE_COMFORT, text: "Does the child have specific interests they talk about frequently?" },
    { id: 17, domain: DOMAINS.REPETITIVE_COMFORT, text: "Can the child engage in preferred activities without becoming overly rigid?" },
    { id: 18, domain: DOMAINS.REPETITIVE_COMFORT, text: "Does the child use repetitive behaviors to manage stress or excitement?" },
    { id: 19, domain: DOMAINS.REPETITIVE_COMFORT, text: "Can the child tolerate variations in their preferred routines?" },
    { id: 20, domain: DOMAINS.REPETITIVE_COMFORT, text: "Does the child show deep knowledge about specific topics of interest?" },

    // Domain 5: Task Persistence (5 questions)
    { id: 21, domain: DOMAINS.TASK_PERSISTENCE, text: "Can the child complete age-appropriate tasks (coloring page, simple craft)?" },
    { id: 22, domain: DOMAINS.TASK_PERSISTENCE, text: "Does the child persist with challenging tasks before asking for help?" },
    { id: 23, domain: DOMAINS.TASK_PERSISTENCE, text: "Can the child stay focused during structured activities (circle time, lessons)?" },
    { id: 24, domain: DOMAINS.TASK_PERSISTENCE, text: "Does the child finish started activities before moving to new ones?" },
    { id: 25, domain: DOMAINS.TASK_PERSISTENCE, text: "Can the child work independently for 10-15 minutes?" },

    // Domain 6: Verbal & Expressive Communication (5 questions)
    { id: 26, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Can the child follow two-step verbal instructions?" },
    { id: 27, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Does the child use complete sentences (4+ words) regularly?" },
    { id: 28, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Can the child express their feelings and needs verbally?" },
    { id: 29, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Does the child engage in back-and-forth conversations?" },
    { id: 30, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Can the child answer 'who,' 'what,' and 'where' questions?" },

    // Domain 7: Transition & Adaptability (5 questions)
    { id: 31, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Can the child transition from preferred to non-preferred activities?" },
    { id: 32, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Does the child adapt to changes in daily schedule with support?" },
    { id: 33, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Can the child handle unexpected changes (substitute teacher, cancelled plans)?" },
    { id: 34, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Does the child use visual schedules or timers to manage transitions?" },
    { id: 35, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Can the child recover from transitions within a reasonable time?" },

    // Domain 8: Fine Motor & Structured Engagement (5 questions)
    { id: 36, domain: DOMAINS.FINE_MOTOR, text: "Can the child use scissors to cut along a line?" },
    { id: 37, domain: DOMAINS.FINE_MOTOR, text: "Does the child hold a pencil with a functional grip?" },
    { id: 38, domain: DOMAINS.FINE_MOTOR, text: "Can the child copy simple shapes and letters?" },
    { id: 39, domain: DOMAINS.FINE_MOTOR, text: "Does the child manage fasteners (buttons, zippers) independently?" },
    { id: 40, domain: DOMAINS.FINE_MOTOR, text: "Can the child participate in fine motor activities (beading, playdough)?" },
  ],

  "8-12": [
    // Domain 1: Pattern & Logic Affinity (5 questions)
    { id: 1, domain: DOMAINS.PATTERN_LOGIC, text: "Can the child solve multi-step logic problems or puzzles?" },
    { id: 2, domain: DOMAINS.PATTERN_LOGIC, text: "Does the child excel in pattern recognition (math, coding, music)?" },
    { id: 3, domain: DOMAINS.PATTERN_LOGIC, text: "Can the child understand and apply rules in games or systems?" },
    { id: 4, domain: DOMAINS.PATTERN_LOGIC, text: "Does the child show advanced reasoning in areas of interest?" },
    { id: 5, domain: DOMAINS.PATTERN_LOGIC, text: "Can the child identify inconsistencies or errors in information?" },

    // Domain 2: Spatial & Constructive Thinking (5 questions)
    { id: 6, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Can the child create detailed constructions or designs?" },
    { id: 7, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Does the child understand maps, diagrams, and spatial relationships?" },
    { id: 8, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Can the child visualize and manipulate objects mentally?" },
    { id: 9, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Does the child excel in activities requiring spatial reasoning?" },
    { id: 10, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Can the child follow complex assembly instructions independently?" },

    // Domain 3: Sensory Regulation (5 questions)
    { id: 11, domain: DOMAINS.SENSORY_REGULATION, text: "Can the child self-advocate when environments are overwhelming?" },
    { id: 12, domain: DOMAINS.SENSORY_REGULATION, text: "Does the child use effective strategies to manage sensory needs?" },
    { id: 13, domain: DOMAINS.SENSORY_REGULATION, text: "Can the child participate in varied environments with accommodations?" },
    { id: 14, domain: DOMAINS.SENSORY_REGULATION, text: "Does the child recognize their sensory triggers and limits?" },
    { id: 15, domain: DOMAINS.SENSORY_REGULATION, text: "Can the child maintain regulation during challenging sensory situations?" },

    // Domain 4: Repetitive Comfort Behavior (5 questions)
    { id: 16, domain: DOMAINS.REPETITIVE_COMFORT, text: "Does the child have deep expertise in specific interest areas?" },
    { id: 17, domain: DOMAINS.REPETITIVE_COMFORT, text: "Can the child balance special interests with other responsibilities?" },
    { id: 18, domain: DOMAINS.REPETITIVE_COMFORT, text: "Does the child use routines and rituals to manage anxiety?" },
    { id: 19, domain: DOMAINS.REPETITIVE_COMFORT, text: "Can the child share their interests with others appropriately?" },
    { id: 20, domain: DOMAINS.REPETITIVE_COMFORT, text: "Does the child show flexibility within their areas of interest?" },

    // Domain 5: Task Persistence (5 questions)
    { id: 21, domain: DOMAINS.TASK_PERSISTENCE, text: "Can the child complete long-term projects with planning?" },
    { id: 22, domain: DOMAINS.TASK_PERSISTENCE, text: "Does the child persist through challenging academic work?" },
    { id: 23, domain: DOMAINS.TASK_PERSISTENCE, text: "Can the child break down complex tasks into manageable steps?" },
    { id: 24, domain: DOMAINS.TASK_PERSISTENCE, text: "Does the child maintain focus during extended work periods?" },
    { id: 25, domain: DOMAINS.TASK_PERSISTENCE, text: "Can the child self-monitor progress toward goals?" },

    // Domain 6: Verbal & Expressive Communication (5 questions)
    { id: 26, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Can the child express complex thoughts and ideas clearly?" },
    { id: 27, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Does the child engage in age-appropriate conversations?" },
    { id: 28, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Can the child advocate for their needs in various settings?" },
    { id: 29, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Does the child understand and use figurative language?" },
    { id: 30, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Can the child adjust communication style for different audiences?" },

    // Domain 7: Transition & Adaptability (5 questions)
    { id: 31, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Can the child manage transitions between classes or activities?" },
    { id: 32, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Does the child adapt to changes in plans or expectations?" },
    { id: 33, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Can the child handle unexpected disruptions to routine?" },
    { id: 34, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Does the child use coping strategies during transitions?" },
    { id: 35, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Can the child maintain friendships despite changes?" },

    // Domain 8: Fine Motor & Structured Engagement (5 questions)
    { id: 36, domain: DOMAINS.FINE_MOTOR, text: "Can the child write legibly for extended periods?" },
    { id: 37, domain: DOMAINS.FINE_MOTOR, text: "Does the child manage all self-care tasks independently?" },
    { id: 38, domain: DOMAINS.FINE_MOTOR, text: "Can the child engage in detailed fine motor activities (art, crafts)?" },
    { id: 39, domain: DOMAINS.FINE_MOTOR, text: "Does the child type efficiently on keyboard or device?" },
    { id: 40, domain: DOMAINS.FINE_MOTOR, text: "Can the child participate in activities requiring precision?" },
  ],

  "13+": [
    // Domain 1: Pattern & Logic Affinity (5 questions)
    { id: 1, domain: DOMAINS.PATTERN_LOGIC, text: "Does the teen show hyper-focused expertise in complex systems?" },
    { id: 2, domain: DOMAINS.PATTERN_LOGIC, text: "Can the teen apply logical reasoning to real-world problems?" },
    { id: 3, domain: DOMAINS.PATTERN_LOGIC, text: "Does the teen excel in analytical subjects (math, science, coding)?" },
    { id: 4, domain: DOMAINS.PATTERN_LOGIC, text: "Can the teen identify patterns in social or academic contexts?" },
    { id: 5, domain: DOMAINS.PATTERN_LOGIC, text: "Does the teen demonstrate advanced problem-solving abilities?" },

    // Domain 2: Spatial & Constructive Thinking (5 questions)
    { id: 6, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Can the teen create complex designs or technical drawings?" },
    { id: 7, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Does the teen excel in subjects requiring spatial reasoning?" },
    { id: 8, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Can the teen navigate complex environments independently?" },
    { id: 9, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Does the teen show talent in visual or spatial arts?" },
    { id: 10, domain: DOMAINS.SPATIAL_CONSTRUCTIVE, text: "Can the teen understand and create complex systems or models?" },

    // Domain 3: Sensory Regulation (5 questions)
    { id: 11, domain: DOMAINS.SENSORY_REGULATION, text: "Can the teen identify and communicate sensory needs?" },
    { id: 12, domain: DOMAINS.SENSORY_REGULATION, text: "Does the teen use effective self-regulation strategies?" },
    { id: 13, domain: DOMAINS.SENSORY_REGULATION, text: "Can the teen manage sensory challenges in school/work?" },
    { id: 14, domain: DOMAINS.SENSORY_REGULATION, text: "Does the teen advocate for sensory accommodations?" },
    { id: 15, domain: DOMAINS.SENSORY_REGULATION, text: "Can the teen maintain regulation in varied environments?" },

    // Domain 4: Repetitive Comfort Behavior (5 questions)
    { id: 16, domain: DOMAINS.REPETITIVE_COMFORT, text: "Does the teen have passionate interests that provide comfort?" },
    { id: 17, domain: DOMAINS.REPETITIVE_COMFORT, text: "Can the teen channel interests into productive activities?" },
    { id: 18, domain: DOMAINS.REPETITIVE_COMFORT, text: "Does the teen use routines to manage stress effectively?" },
    { id: 19, domain: DOMAINS.REPETITIVE_COMFORT, text: "Can the teen balance interests with other life demands?" },
    { id: 20, domain: DOMAINS.REPETITIVE_COMFORT, text: "Does the teen connect with others through shared interests?" },

    // Domain 5: Task Persistence (5 questions)
    { id: 21, domain: DOMAINS.TASK_PERSISTENCE, text: "Can the teen manage multi-step homework assignments?" },
    { id: 22, domain: DOMAINS.TASK_PERSISTENCE, text: "Does the teen persist through challenging academic work?" },
    { id: 23, domain: DOMAINS.TASK_PERSISTENCE, text: "Can the teen plan and execute long-term projects?" },
    { id: 24, domain: DOMAINS.TASK_PERSISTENCE, text: "Does the teen maintain focus in areas of interest?" },
    { id: 25, domain: DOMAINS.TASK_PERSISTENCE, text: "Can the teen use executive function strategies effectively?" },

    // Domain 6: Verbal & Expressive Communication (5 questions)
    { id: 26, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Can the teen express needs and opinions clearly?" },
    { id: 27, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Does the teen engage in meaningful conversations?" },
    { id: 28, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Can the teen advocate for themselves in various settings?" },
    { id: 29, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Does the teen communicate effectively in writing?" },
    { id: 30, domain: DOMAINS.VERBAL_EXPRESSIVE, text: "Can the teen navigate social communication expectations?" },

    // Domain 7: Transition & Adaptability (5 questions)
    { id: 31, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Can the teen manage transitions between activities/classes?" },
    { id: 32, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Does the teen adapt to changes in schedule or plans?" },
    { id: 33, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Can the teen handle unexpected changes with support?" },
    { id: 34, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Does the teen use strategies to manage transitions?" },
    { id: 35, domain: DOMAINS.TRANSITION_ADAPTABILITY, text: "Can the teen prepare for major life transitions?" },

    // Domain 8: Fine Motor & Structured Engagement (5 questions)
    { id: 36, domain: DOMAINS.FINE_MOTOR, text: "Can the teen complete all fine motor tasks independently?" },
    { id: 37, domain: DOMAINS.FINE_MOTOR, text: "Does the teen manage personal care and hygiene?" },
    { id: 38, domain: DOMAINS.FINE_MOTOR, text: "Can the teen engage in detailed work (art, tech, crafts)?" },
    { id: 39, domain: DOMAINS.FINE_MOTOR, text: "Does the teen type or write efficiently for academic work?" },
    { id: 40, domain: DOMAINS.FINE_MOTOR, text: "Can the teen participate in activities requiring dexterity?" },
  ],
};

// Helper function to get domain display names
export const getDomainDisplayName = (domainKey: string): string => {
  const displayNames: Record<string, string> = {
    [DOMAINS.PATTERN_LOGIC]: "Pattern & Logic Affinity",
    [DOMAINS.SPATIAL_CONSTRUCTIVE]: "Spatial & Constructive Thinking",
    [DOMAINS.SENSORY_REGULATION]: "Sensory Regulation",
    [DOMAINS.REPETITIVE_COMFORT]: "Repetitive Comfort Behavior",
    [DOMAINS.TASK_PERSISTENCE]: "Task Persistence",
    [DOMAINS.VERBAL_EXPRESSIVE]: "Verbal & Expressive Communication",
    [DOMAINS.TRANSITION_ADAPTABILITY]: "Transition & Adaptability",
    [DOMAINS.FINE_MOTOR]: "Fine Motor & Structured Engagement",
  };
  return displayNames[domainKey] || domainKey;
};
