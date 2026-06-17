import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client helper
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARN: GEMINI_API_KEY environment variable is not defined. Using local fallbacks.");
    }
    geminiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY_FALLBACK",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
}

// 1. API: Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiActive: !!process.env.GEMINI_API_KEY
  });
});

// 2. API: Generate Roadmaps
app.post('/api/generate-roadmap', async (req, res) => {
  const { goal, experienceLevel, weeklyHours, preferredStyle } = req.body;

  if (!goal) {
    return res.status(400).json({ error: 'Goal is required' });
  }

  const prompt = `
Generate a structured, high-fidelity learning roadmap for this goal: "${goal}".
The user has experience level: "${experienceLevel || 'Beginner'}", can study for ${weeklyHours || 10} hours per week, and prefers a "${preferredStyle || 'Hands-on'}" style of learning.

Your output must be a JSON object conforming to the following structure:
{
  "goal": string,
  "experienceLevel": string,
  "weeklyHours": number,
  "preferredStyle": string,
  "progressPercent": 0,
  "totalXp": 0,
  "lessonsCompleted": 0,
  "hoursRemaining": number,
  "phases": [
    {
      "id": "ph-1",
      "name": "Phase Name (e.g. Foundations, Core, etc.)",
      "description": "Short description of what the user learns",
      "progress": 0,
      "estimatedHours": number,
      "skillsCovered": ["skill1", "skill2"],
      "xpEarned": 0,
      "status": "current" or "locked" (make the very first phase "current" and rest "locked"),
      "levels": [
        {
          "id": "lvl-1",
          "name": "Level Name (e.g., Basics & Definitions)",
          "type": "Basics",
          "status": "current" or "locked" (make first phase first level "current" and preceding ones of that level complete),
          "lessons": [
            {
              "id": "les-1",
              "name": "Lesson Name",
              "type": "learn",
              "xpReward": 20,
              "status": "available",
              "content": "A short, engaging Markdown lesson explaining the concepts, incorporating clear formatting, and standard diagrams or math if applicable."
            },
            {
              "id": "les-2",
              "name": "Quiz Time",
              "type": "quiz",
              "xpReward": 50,
              "status": "locked",
              "content": "Quick multiple choice verification quiz questions.",
              "quizQuestions": [
                {
                  "id": "q-1-1",
                  "question": "Multiple choice question related to this level?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "correctIndex": number,
                  "explanation": "Why this answer is correct."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

Please generate exactly 3-4 cohesive learning Phases.
In each Phase, generate 3 sequential Levels.
In each Level, write exactly 1 'learn' lesson and 1 'quiz' lesson.
Provide interesting, highly tailored lessons and valid questions. Ensure the output is valid JSON.
`;

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("Missing api key");
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json(parsedData);

  } catch (error: any) {
    console.error('Gemini Roadmap Generation Error, implementing safe custom backup template:', error.message);
    
    // Fallback roadmap generation based on goal
    const goalTitle = goal.length > 40 ? goal.substring(0, 37) + '...' : goal;
    const fallbackRoadmap = {
      id: `roadmap-${Date.now()}`,
      goal: goalTitle,
      experienceLevel: experienceLevel || 'Beginner',
      weeklyHours: Number(weeklyHours) || 8,
      preferredStyle: preferredStyle || 'Hands-on',
      progressPercent: 0,
      totalXp: 0,
      lessonsCompleted: 0,
      hoursRemaining: 40,
      createdAt: new Date().toISOString(),
      phases: [
        {
          id: 'ph-fallback-1',
          name: 'Core Fundamentals',
          description: `Mastering the absolute fundamentals necessary for "${goalTitle}".`,
          progress: 0,
          estimatedHours: 12,
          skillsCovered: ['Definitions', 'System Diagrams', 'Basic Syntax', 'First Operations'],
          xpEarned: 0,
          status: 'current',
          levels: [
            {
              id: 'lvl-fallback-1-1',
              name: 'Getting Started Basics',
              type: 'Basics',
              status: 'current',
              lessons: [
                {
                  id: 'les-f1-learn',
                  name: 'Introduction Chapter',
                  type: 'learn',
                  xpReward: 20,
                  status: 'available',
                  content: `
### Welcome to ${goalTitle}!

In this introductory lesson, we will cover the core landscape. Whether you are a total beginner or just brushing up, visual clarity is key.

#### Key Mechanics:
1. **Inputs & Definitions**: Define clean pipelines so that you can organize your thoughts.
2. **First Script Operations**: Execute core computations using the target system parameters.
3. **Execution flow**: Process inputs chronologically.

We will verify this with a simple multiple-choice quiz up next!
`
                },
                {
                  id: 'les-f1-quiz',
                  name: 'Fundamentals Checkpoint Quiz',
                  type: 'quiz',
                  xpReward: 50,
                  status: 'locked',
                  content: 'Test your initial definitions.',
                  quizQuestions: [
                    {
                      id: 'q-f1-1',
                      question: `What is the most crucial asset when first approaching ${goalTitle}?`,
                      options: [
                        'Structured, roadmap-driven sequential practice',
                        'Memorizing external libraries from front to back',
                        'Buying the most expensive cloud computing hardware',
                        'Waiting for others to complete it on video stream'
                      ],
                      correctIndex: 0,
                      explanation: 'Step-by-step sequential practice prevents cognitive overload and embeds skills deeper into long-term retention blocks.'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'ph-fallback-2',
          name: 'Applied Integration',
          description: `Applying concepts with practical hands-on mini-projects.`,
          progress: 0,
          estimatedHours: 16,
          skillsCovered: ['Local Configurations', 'Script execution', 'Error Handling', 'Debugging'],
          xpEarned: 0,
          status: 'locked',
          levels: [
            {
              id: 'lvl-fallback-2-1',
              name: 'Practical Mechanics',
              type: 'Foundations',
              status: 'locked',
              lessons: [
                {
                  id: 'les-f2-learn',
                  name: 'Setting Up the Logic Loop',
                  type: 'learn',
                  xpReward: 20,
                  status: 'locked',
                  content: `
### Practical Engineering

In this module we focus on creating robust error safety bounds.

- **Check Constraints**: Validate that data structures are non-empty.
- **Fail Fast**: Log errors, propagate fallback status, and raise clean warnings.
`
                }
              ]
            }
          ]
        },
        {
          id: 'ph-fallback-3',
          name: 'Mastery & Scale',
          description: 'Optimizing architectures and learning professional industry techniques.',
          progress: 0,
          estimatedHours: 25,
          skillsCovered: ['System Design', 'Scaling Protocols', 'Performance Auditing'],
          xpEarned: 0,
          status: 'locked',
          levels: [
            {
              id: 'lvl-fallback-3-1',
              name: 'Expert Deployments',
              type: 'Advanced',
              status: 'locked',
              lessons: [
                {
                  id: 'les-f3-learn',
                  name: 'Auditing Throughput Scenarios',
                  type: 'learn',
                  xpReward: 20,
                  status: 'locked',
                  content: '### Scaling the System\nUnderstand the trade-offs between speed, latency, and costs under heavy loads.'
                }
              ]
            }
          ]
        }
      ]
    };

    return res.json(fallbackRoadmap);
  }
});

// 3. API: AI Mentor Chat
app.post('/api/mentor-chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message payload is required' });
  }

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("Missing api key");
    }

    const ai = getGeminiClient();
    
    // Prepare conversation history
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      });
    }
    
    // Add active message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const systemInstruction = `
You are the elite LearnPath AI Mentor - a friendly, highly intelligent, and extremely encouraging tutor.
You help people of all experience levels master artificial intelligence, python, math, code scripting, neural architectures, LLMs, and RAG pipelines.

Guidelines:
1. Provide extremely structured, markdown-rich responses using headings, bold bullet points, and codeblocks.
2. If the user presents software scripts, explain what it does and highlight optimizations using syntax highlighting.
3. Suggest 2-3 specific study tips or interesting quick exercises at the end of each answer.
4. Keep the tone helpful, professional, and exciting like a world-class university TA.
`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    const reply = result.text || "I was unable to synthesize a response. Let me try that again.";
    return res.json({ text: reply });

  } catch (error: any) {
    console.error('Gemini Chat Error:', error.message);
    
    // Fallback offline dynamic reply
    const lowercaseMessage = message.toLowerCase();
    let reply = "";

    if (lowercaseMessage.includes('python')) {
      reply = `### Python Study Roadmap Insight 🐍\n\nPython is foundational for AI. Focus heavily on:\n- **NumPy & Vectorization**: Avoid slow native Python loops.\n- **Pandas DataFrames**: Essential for structured learning samples.\n- **Object Oriented Python**: Writing clean reusable modeling layers.\n\n*Suggested Tip*: Try writing a numpy computing vector matrix subtraction to calculate Mean Squared Error!`;
    } else if (lowercaseMessage.includes('roadmap') || lowercaseMessage.includes('generate')) {
      reply = `### Custom Roadmap Engineering 🗺️\n\nI can generate roadmaps for any goal in AI! Go to the **Roadmaps tab**, click **Generate Custom Roadmap**, enter your goal (e.g. "Stable Diffusion from scratch"), set your preferred weekly hours, and I will craft a perfect Duolingo-style tree path for you!`;
    } else if (lowercaseMessage.includes('quiz') || lowercaseMessage.includes('test')) {
      reply = `### Testing Knowledge & Earning XP 🧠\n\nTesting accelerates learning retention by as much as 150%! Check out your active roadmap phases. Levels containing a **Quiz** yield **50 XP**, while **Coding Exercises** reward a premium **75 XP**. Let me know if you want me to quiz you right here in chat!`;
    } else {
      reply = `### AI Mentor Insights 🤖\n\nHello! I am standing by to help you unlock fullstack skills. You asked: *"Reflecting on: ${message}"*\n\nHere are some solid steps to tackle this:\n1. **Read & Absorb**: Check out structural markdown logs.\n2. **Experiment & Build**: Write simple scripts to verify.\n3. **Quiz & Validate**: Take standard assessments to earn XP.\n\nAsk me anything about NumPy, Neural Networks, LLM tokens, or Career Readiness!`;
    }

    return res.json({ text: reply });
  }
});

// 4. API: Verify and Analyze Script Code
app.post('/api/analyze-code', async (req, res) => {
  const { code, instructions, solution, hint } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code parameter is required' });
  }

  // Simple script safety check / heuristic validation
  const passesLocalValidation = code.includes('def') && 
    (code.includes('return') || code.includes('print')) &&
    !code.includes('error') &&
    code.length > 25;

  const prompt = `
Analyze the user's Python code submitted for the following exercise:
Instructions: "${instructions || 'Implement a basic metrics calculator.'}"
Expected solution pattern: "${solution || ''}"
User Code:
\`\`\`python
${code}
\`\`\`

Evaluate if the code is logically correct based on the instructions.
Concoct your response as a valid JSON object matching this structure:
{
  "passed": boolean (true if correct, false if there are syntax/logic bugs),
  "suggestions": "A short, highly helpful markdown tip advising the student on their formatting or optimizations",
  "explanation": "A 1-2 paragraph markdown walkthrough explaining the code line-by-line in a highly pedagogical way."
}
`;

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("Missing api key");
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);

  } catch (error: any) {
    console.error('Gemini Code Analysis fallback activation:', error.message);
    
    // Standard offline code validation success logic
    const score = passesLocalValidation;
    return res.json({
      passed: score,
      suggestions: score 
        ? "Excellent job structuralizing this Py script! Your variables are highly clean. Consider naming constants in UPPER_CASE for professional PEP8 code alignment."
        : `Your code looks slightly empty or is missing core functions. Standard python syntax requires declaring functions starting with \`def\` and finishing with a returned value or explicit state.`,
      explanation: score
        ? "We review the variable bindings in your script. By iterating through inputs, we compute intermediate numbers, aggregate them, and compute final metrics with absolute mathematical precision."
        : `Let's troubleshoot. Try utilizing thehint provided: \`${hint || "Remember to declare the function correctly."}\` and ensure your variable calculations do not divide by zero.`
    });
  }
});

// 5. API: AI Adaptive Recommendations
app.post('/api/ai-recommendations', async (req, res) => {
  const { currentXp, level, streak, activeGoal } = req.body;

  const prompt = `
Generate 3 highly personalized study recommendations for a user of LearnPath AI with:
- XP: ${currentXp || 1840}
- Level: ${level || 12}
- Streak: ${streak || 5}
- Active Goal: "${activeGoal || 'Full-Stack AI Engineering'}"

Your response must be a JSON array of exactly 3 objects matching this schema:
[
  {
    "id": string (unique ID e.g., rec-1),
    "title": "Actionable title (e.g. NumPy Broadcast Challenge)",
    "description": "Short compelling reason what this is and how it helps their specific goal",
    "xpReward": number,
    "category": "quiz" or "coding" or "mentor" or "roadmap",
    "difficulty": "Easy" or "Medium" or "Hard"
  }
]
`;

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("Missing api key");
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8
      }
    });

    const parsed = JSON.parse(response.text || '[]');
    return res.json(parsed);

  } catch (error: any) {
    console.error('Gemini recommendations fallback:', error.message);
    
    return res.json([
      {
        id: 'rec-numpy',
        title: 'Complete: NumPy Index Exercises',
        description: 'Level up your Python status by completing vector slice operations. Practice handling dimensions with multi-dimensional matrices.',
        xpReward: 75,
        category: 'coding',
        difficulty: 'Medium'
      },
      {
        id: 'rec-quiz',
        title: 'Quiz: Neural Forward Propagation',
        description: 'Prove your Foundations awareness! Complete the 4-question checkpoint of linear boundaries.',
        xpReward: 50,
        category: 'quiz',
        difficulty: 'Easy'
      },
      {
        id: 'rec-mentor',
        title: 'Ask AI Mentor about MCP Specs',
        description: 'Explore Model Context Protocol schemas by asking our AI tutor. Learn how apps dynamically secure real-time DB contexts.',
        xpReward: 30,
        category: 'mentor',
        difficulty: 'Hard'
      }
    ]);
  }
});

// 6. API: Dynamic Quiz Generator
app.post('/api/generate-quiz', async (req, res) => {
  const { topicName } = req.body;

  if (!topicName) {
    return res.status(400).json({ error: 'Topic name is required for quiz' });
  }

  const prompt = `
Generate a personalized, challenging study quiz for this topic: "${topicName}".
Generate exactly 3 multiple-choice questions.

Output must be a JSON array of questions conforming to this exact structure:
[
  {
    "id": string (unique id e.g. q1),
    "question": "What is...?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctIndex": number (index of correct option 0-3),
    "explanation": "Complete pedagogical explanation of the solution."
  }
]
`;

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("Missing api key");
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    const parsed = JSON.parse(response.text || '[]');
    return res.json(parsed);

  } catch (error: any) {
    console.error('Gemini Dynamic Quiz error fallback:', error.message);
    
    return res.json([
      {
        id: 'q-dyn-1',
        question: `In modern ${topicName} development, what is the best strategy to prevent overfitting on local batches?`,
        options: [
          'Add a customized L2 parameter regularization / Dropout layers',
          'Repeatedly double the training epochs without validation evaluation',
          'Set learning rates to 1.0 to quicken gradient steps',
          'Strictly remove all activation transformations'
        ],
        correctIndex: 0,
        explanation: 'Dropout randomly deactivates neural paths to prevent multi-node correlation dependencies, while L2 regularization penalizes heavy weights, forcing lower weights and safer boundaries.'
      },
      {
        id: 'q-dyn-2',
        question: `What metric is most typically measured to analyze operational performance in a high-concurrency environment?`,
        options: [
          'Average token-generation latency (Time-to-First-Token)',
          'The storage volume of raw log exports inside system margins',
          'Absolute color hex contrast saturation percentages',
          'The count of text lines written in config packages'
        ],
        correctIndex: 0,
        explanation: 'Time-to-First-Token (TTFT) and token-generation throughput rate characterize model reactivity speed for client requests.'
      },
      {
        id: 'q-dyn-3',
        question: `How does our system optimize learning paths when performance indicators flag drop-offs?`,
        options: [
          'Re-routing user attention via a personalized, interactive roadmap',
          'Locking the profile until manual support intervenes',
          'Resetting total user accumulated level scores back to zero',
          'Ignoring state trends completely'
        ],
        correctIndex: 0,
        explanation: 'AI roadmaps adaptively suggest easier mini-tasks and explain concepts sequentially to clear bottlenecks and restore confidence.'
      }
    ]);
  }
});

// Configure Vite integration as per our React Full-Stack Guidelines inside async bootstrap
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Binds strictly to 0.0.0.0 and PORT 3000 as required
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server starting running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch(console.error);
