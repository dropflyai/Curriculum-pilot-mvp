// Week 1 — AI Classifier (School Supplies)
// Standards: SC.912.ET.2.2, SC.912.ET.2.3, SC.912.ET.2.5

export interface LessonTest {
  id: string
  desc: string
}

export interface QuizQuestion {
  prompt: string
  options: string[]
  answer_index: number
}

export interface LessonMode {
  type: 'main' | 'bonus'
  title: string
  dataset: string
  labels: string[]
  learn_md: string
  code: {
    starter: string
  }
  tests_ui: LessonTest[]
  quiz: {
    questions: QuizQuestion[]
  }
  checklist: string[]
  submit: {
    prompt: string
    rubric: {
      exceeds: string[]
      meets: string[]
      approaching: string[]
      beginning: string[]
    }
    badges_on_complete: string[]
  }
}

export interface AILesson {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  standards: string[]
  modes: LessonMode[]
}

export const aiLessons: AILesson[] = [
  {
    id: 'week-01',
    title: 'AI Classifier — School Supplies',
    description: 'Train your first image classifier using school supplies, learn about fairness and accuracy, and explore real-world applications.',
    difficulty: 'beginner',
    estimatedTime: '60 minutes in class + 60 minutes homework',
    standards: [
      'SC.912.ET.2.2: Describe major branches of AI',
      'SC.912.ET.2.3: Evaluate the application of algorithms to AI',
      'SC.912.ET.2.5: Describe major applications of AI & ML across fields'
    ],
    modes: [
      {
        type: 'main',
        title: 'School Supplies Classifier',
        dataset: 'school-supplies',
        labels: ['pencil', 'eraser', 'marker'],
        learn_md: `## How can a computer tell school supplies apart?
**Today's goal:** Train a tiny image classifier on a **pre-curated dataset** (no cameras) and judge its quality with simple metrics.

**Key ideas:** AI vs. ML • labels & datasets • training vs. inference • accuracy & confusion matrix • fairness & representativeness

### Warm-up (2–3 min)
1) Drag-and-drop: Match the term to the definition — *dataset, label, accuracy*.
2) Think-pair-share: Which would hurt a model more: **blurry images** or **unbalanced labels**? Why?

### Mini-explainer
1) Pick labels → 2) Load images → 3) Train → 4) Test → 5) Improve data → 6) Retrain.
*Ethics checkpoint:* Are our images representative of each label?`,
        code: {
          starter: `# UI-driven lesson (no code edit needed). The trainer reads this config.
DATASET = "school-supplies"
LABELS = ["pencil", "eraser", "marker"]
# Steps in the UI:
# 1) Load dataset  2) Train  3) View metrics  4) Improve data (remove ≥5 low-quality or duplicate images)
# 5) Retrain  6) Compare metrics and write your short reflection`
        },
        tests_ui: [
          {
            id: 'dataset_loaded',
            desc: "Opened the 'school-supplies' dataset and viewed label counts."
          },
          {
            id: 'trained_once',
            desc: "Completed an initial training run and opened the metrics panel."
          },
          {
            id: 'metrics_compared',
            desc: "After removing ≥5 low-quality/duplicate images, retrained and compared accuracy + per-class accuracy."
          },
          {
            id: 'confusion_read',
            desc: "Answered the 3 short questions about the mini confusion matrix."
          },
          {
            id: 'ethics_note',
            desc: "Submitted a 3–4 sentence ethics note on representativeness and mitigation."
          }
        ],
        quiz: {
          questions: [
            {
              prompt: "What does *training* do?",
              options: ["Makes predictions", "Learns from labeled examples", "Compresses images", "Fixes blurry photos"],
              answer_index: 1
            },
            {
              prompt: "Why can accuracy be misleading?",
              options: ["It never changes", "It ignores per-class errors", "It is not a number", "It replaces labels"],
              answer_index: 1
            },
            {
              prompt: "A **label** is…",
              options: ["A file format", "The name of a category for an image", "A camera setting", "A model weight"],
              answer_index: 1
            },
            {
              prompt: "Which action improves fairness most?",
              options: ["Add music to slides", "Equalize label counts and remove duplicates", "Zoom into random pixels", "Lower the screen brightness"],
              answer_index: 1
            }
          ]
        },
        checklist: [
          "I can say how training and inference are different.",
          "I viewed overall accuracy and per-class accuracy.",
          "I improved the dataset (quality or balance) and retrained.",
          "I interpreted a tiny confusion matrix.",
          "I wrote an ethics/mitigation note."
        ],
        submit: {
          prompt: `**Mini-Project (10 min):** Make the model **clearer or fairer**.
Choose one path:
1) Rebalance labels (equal counts), or
2) Improve quality (remove blur/dupes), or
3) Add a small 4th label (10–20 images) and document impact.
**Turn in:** metrics before/after + 90-sec audio/video note + 3-bullet mitigation plan.`,
          rubric: {
            exceeds: [
              "Pre/post metrics show a justified improvement (not just luck).",
              "Confusion matrix insight is specific (names hardest class and plausible cause).",
              "Two or more concrete mitigations listed and tied to evidence."
            ],
            meets: [
              "Trained twice and compared metrics correctly.",
              "One limitation + one mitigation identified."
            ],
            approaching: [
              "Only one train run or unclear comparison; vague ethics note."
            ],
            beginning: [
              "No metrics evidence; no ethics note."
            ]
          },
          badges_on_complete: ["AI Classifier Novice"]
        }
      },
      {
        type: 'bonus',
        title: 'Recycle Ethics (Plastic/Paper/Metal)',
        dataset: 'recycle-audit',
        labels: ['plastic', 'paper', 'metal'],
        learn_md: `## Real-world ethics: Recycling matters
**Goal:** Experience how messier, real-world data (Plastic/Paper/Metal) changes metrics and fairness.
**Key idea:** Misclassifications have **costs** (wrong bin → contamination → higher processing cost).

Quick compare: Why might *shiny metal* vs. *glossy plastic* confuse a model?`,
        code: {
          starter: `DATASET = "recycle-audit"
LABELS = ["plastic", "paper", "metal"]
# Follow the same 6 steps as the main lesson, but pay special attention to per-class errors and false positives.`
        },
        tests_ui: [
          {
            id: 'recycle_trained',
            desc: "Completed a training run on Plastic/Paper/Metal and opened metrics."
          },
          {
            id: 'hardest_class_identified',
            desc: "Identified the hardest class from the confusion matrix with a plausible reason."
          },
          {
            id: 'mitigation_proposed',
            desc: "Proposed ≥2 targeted mitigations (e.g., more matte plastic, varied paper textures)."
          },
          {
            id: 'cost_reasoned',
            desc: "Wrote 2–3 sentences on the *cost* of a misclassification and who is affected."
          }
        ],
        quiz: {
          questions: [
            {
              prompt: "A **false positive** for Metal when the item is Plastic most likely causes…",
              options: ["Better recycling revenue", "Contamination/extra sorting cost", "No effect", "Higher camera brightness"],
              answer_index: 1
            },
            {
              prompt: "Which dataset tweak helps most with glare?",
              options: ["Add more shiny examples of each class", "Delete the metal class", "Lower model size", "Randomly rotate images only"],
              answer_index: 0
            },
            {
              prompt: "Per-class accuracy matters because…",
              options: ["It equals overall accuracy", "It reveals which class is being mis-served", "It is easier to compute", "It removes bias automatically"],
              answer_index: 1
            },
            {
              prompt: "Which is an **ethical** mitigation?",
              options: ["Hide metrics from users", "Document limitations and collect more diverse samples", "Delete low-scoring classes silently", "Promise 100% accuracy"],
              answer_index: 1
            }
          ]
        },
        checklist: [
          "I trained and evaluated the recycle dataset.",
          "I identified the hardest class and a likely cause.",
          "I proposed at least two mitigations.",
          "I explained the real-world cost of one misclassification."
        ],
        submit: {
          prompt: `**Bonus Challenge (10–15 min):** Write a short **Ethics & Impact** memo (120–180 words).
Include 1 metric insight, 2 mitigations, and who is affected by errors (students, staff, city).
Attach a metrics screenshot.`,
          rubric: {
            exceeds: [
              "Memo includes metric insight + two specific mitigations + stakeholder impact.",
              "Mitigations are feasible and tied to the observed errors."
            ],
            meets: [
              "Memo includes metric insight + one mitigation + a named stakeholder."
            ],
            approaching: [
              "Memo lacks specifics or evidence."
            ],
            beginning: [
              "No memo or purely opinion without metrics."
            ]
          },
          badges_on_complete: ["Ethical AI — Starter"]
        }
      }
    ]
  }
]

// Legacy function to maintain compatibility with existing code
export function getAllLessons() {
  return aiLessons.map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    difficulty: lesson.difficulty,
    estimatedTime: lesson.estimatedTime,
    sections: [] // Will be handled by new lesson viewer
  }))
}

// New function to get AI lesson by ID
export function getAILesson(id: string): AILesson | undefined {
  return aiLessons.find(lesson => lesson.id === id)
}

export default aiLessons

// Legacy types for backward compatibility
export interface LessonSection {
  type: 'content' | 'code' | 'quiz'
  title: string
  content?: string
  codeChallenge?: {
    description: string
    startingCode: string
    solution: string
    tests: string[]
    hints?: string[]
  }
  quiz?: {
    type: 'mcq' | 'short'
    q: string
    options?: string[]
    answer?: string
    explanation?: string
  }[]
}

export interface Lesson {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  sections: LessonSection[]
}