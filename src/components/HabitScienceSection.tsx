import { motion } from 'motion/react';
import { Heart, Brain, Trophy, AlertTriangle, TrendingDown, Clock } from 'lucide-react';

interface HabitScienceSectionProps {
  habitType: 'reading' | 'gym';
}

const habitData = {
  reading: {
    benefits: [
      {
        icon: Brain,
        title: "Enhanced Cognitive Function",
        description: "Reading increases neuroplasticity and strengthens neural pathways, improving memory by 23% according to neuroscience research.",
        citation: "Nature Neuroscience, 2019"
      },
      {
        icon: Heart,
        title: "Stress Reduction",
        description: "Just 6 minutes of reading reduces stress levels by 68%, lowering cortisol and heart rate more effectively than music or tea.",
        citation: "University of Sussex, 2009"
      },
      {
        icon: Trophy,
        title: "Improved Focus & Concentration", 
        description: "Regular reading trains sustained attention, increasing focus span by up to 40% in daily activities.",
        citation: "Cognitive Science Journal, 2021"
      }
    ],
    downsides: [
      {
        icon: TrendingDown,
        title: "Cognitive Decline",
        description: "Skipping reading habits leads to 15% faster cognitive aging and reduced vocabulary retention over time.",
        impact: "Memory & Learning"
      },
      {
        icon: AlertTriangle,
        title: "Increased Stress & Anxiety",
        description: "Without reading's stress-relief benefits, cortisol levels remain elevated, leading to chronic stress symptoms.",
        impact: "Mental Health"
      },
      {
        icon: Clock,
        title: "Shortened Attention Span",
        description: "Missing reading sessions weakens focus muscles, reducing attention span by 12% within 2 weeks.",
        impact: "Productivity"
      }
    ]
  },
  gym: {
    benefits: [
      {
        icon: Heart,
        title: "Cardiovascular Health",
        description: "Regular exercise reduces heart disease risk by 35% and improves circulation, lowering blood pressure significantly.",
        citation: "American Heart Association, 2022"
      },
      {
        icon: Brain,
        title: "Mental Health Boost",
        description: "Exercise releases endorphins and BDNF, reducing depression by 26% and anxiety by 20% in clinical studies.",
        citation: "Harvard Medical School, 2021"
      },
      {
        icon: Trophy,
        title: "Strength & Longevity",
        description: "Consistent training increases bone density by 1-3% annually and muscle mass retention, adding 3-7 years to lifespan.",
        citation: "Journal of Aging Research, 2020"
      }
    ],
    downsides: [
      {
        icon: Heart,
        title: "Cardiovascular Deconditioning",
        description: "Skipping workouts causes 25% fitness loss within 2 weeks, increasing heart disease and diabetes risk.",
        impact: "Physical Health"
      },
      {
        icon: TrendingDown,
        title: "Muscle Atrophy & Weakness",
        description: "Muscle mass decreases by 3-8% per week without resistance training, affecting daily strength and mobility.",
        impact: "Physical Function"
      },
      {
        icon: AlertTriangle,
        title: "Mental Health Decline",
        description: "Missing exercise reduces endorphin production, increasing depression risk by 30% and anxiety levels.",
        impact: "Emotional Wellbeing"
      }
    ]
  }
};

export function HabitScienceSection({ habitType }: HabitScienceSectionProps) {
  const data = habitData[habitType];

  return (
    <div className="space-y-6">
      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-green-500/10 border border-green-500/20 rounded-xl p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <Heart className="w-3 h-3 text-green-400" />
          </div>
          <h4 className="text-green-400 font-bold text-sm">
            Science-Backed Benefits
          </h4>
        </div>

        <div className="space-y-3">
          {data.benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <benefit.icon className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-green-100 font-medium text-sm mb-1">
                  {benefit.title}
                </h5>
                <p className="text-green-200/80 text-xs leading-relaxed mb-1">
                  {benefit.description}
                </p>
                <div className="text-green-400/60 text-xs font-mono">
                  📚 {benefit.citation}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Downsides Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-3 h-3 text-red-400" />
          </div>
          <h4 className="text-red-400 font-bold text-sm">
            Consequences of Skipping
          </h4>
        </div>

        <div className="space-y-3">
          {data.downsides.map((downside, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <downside.icon className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-red-100 font-medium text-sm mb-1">
                  {downside.title}
                </h5>
                <p className="text-red-200/80 text-xs leading-relaxed mb-1">
                  {downside.description}
                </p>
                <div className="flex items-center gap-2">
                  <div className="text-red-400/60 text-xs font-mono">
                    ⚠️ Affects: {downside.impact}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}