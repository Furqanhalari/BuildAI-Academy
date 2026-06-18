import type { CourseLevel } from './types'

export const LEVELS: CourseLevel[] = [
  {
    id: 'level-1',
    order: 1,
    title: 'Python Kickstart',
    tagline: 'Make Python talk, think, and remember',
    color: 'green',
    nodes: [
      {
        id: 'node-1-1',
        levelId: 'level-1',
        order: 1,
        title: 'Variables & Print',
        subtitle: 'Make Python talk',
        preClassBrief: [
          'What a variable is and why it matters',
          'How print() shows output to the world',
          'Your first working Python program',
        ],
        classContent: 'We will write our first Python script together live — storing names, numbers, and messages in variables, then printing them in creative ways.',
        taskTitle: 'Personal Introduction Bot',
        taskDescription: `
        Task 1:
        Write a Python script that asks for the user's name and age, then prints a friendly introduction message. Use at least 3 variables and 3 print() calls.

        Task 2 (Challenge):
        Extend the program so it also asks for the user's favorite hobby and future dream career. Print a personalized profile summary using all collected information.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-1-2',
        levelId: 'level-1',
        order: 2,
        title: 'Lists & Loops',
        subtitle: 'Make Python repeat itself',
        preClassBrief: [
          'What a list is and how to store multiple values',
          'The for loop — how to repeat actions automatically',
          'How loops + lists work together',
        ],
        classContent: 'We will build a "to-do list" program live — adding tasks to a list, looping through them, and printing each one with a number.',
        taskTitle: 'Shopping List Manager',
        taskDescription: `
        Task 1:
        Create a Python program with a list of at least 5 items. Loop through and print each item with its number. Then add 2 more items and print the updated list.

        Task 2 (Challenge):
        Create a class roster of 10 students stored in a list. Ask the user to enter a student's name and search through the list to display whether that student is present or not.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-1-3',
        levelId: 'level-1',
        order: 3,
        title: 'Functions',
        subtitle: 'Build your own commands',
        preClassBrief: [
          'What a function is — a reusable block of code',
          'How to define a function with def',
          'Parameters and return values',
        ],
        classContent: 'We will write a calculator together — functions for add, subtract, multiply, and divide — then call them to solve real problems.',
        taskTitle: 'Mini Calculator',
        taskDescription: `
        Task 1:
        Build a calculator with at least 4 functions (add, subtract, multiply, divide). Call each function with different numbers and print the results.

        Task 2 (Challenge):
        Extend the calculator by adding three more functions: square (returns a number multiplied by itself), cube (returns a number raised to the power of 3), and percentage (returns what percentage one number is of another). Test all 7 functions and print the results clearly.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-1-4',
        levelId: 'level-1',
        order: 4,
        title: 'If/Else Logic',
        subtitle: 'Teach Python to think',
        preClassBrief: [
          'How if/elif/else lets Python make decisions',
          'Comparison operators: ==, !=, >, <, >=, <=',
          'Combining conditions with and / or',
        ],
        classContent: 'We will build a number guessing game together — Python picks a random number, the player guesses, and the program tells them if they\'re too high, too low, or correct.',
        taskTitle: 'Number Guessing Game',
        taskDescription: `
        Task 1:
        Build a complete number guessing game. Python picks a random number 1–100. The player gets 5 attempts. Give hints (too high/too low) and tell them if they won or lost.

        Task 2 (Challenge):
        Build a grading system. Ask the user to enter a score. Use if/elif/else to print the grade: 90 and above = A, 80 and above = B, 70 and above = C, anything below 70 = Fail. Display the score, grade, and a motivational message for each result.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-1-5',
        levelId: 'level-1',
        order: 5,
        title: 'File Reading & Writing',
        subtitle: 'Make Python remember things',
        preClassBrief: [
          'How to open, read, and write files in Python',
          'The with open() pattern — why it\'s the safe way',
          'Saving data so it persists between runs',
        ],
        classContent: 'We will build a simple diary app — write an entry, save it to a file, and read all past entries back.',
        taskTitle: 'Personal Diary App',
        taskDescription: `
        Task 1:
        Build a diary app that lets the user write an entry (with today\'s date as heading), saves it to diary.txt, and can display all past entries when asked.

        Task 2 (Challenge):
        Extend the diary app with a search feature. Ask the user to enter a date (e.g. 2025-06-15) and search through diary.txt to find and display only the entries recorded on that date. If no entry is found for that date, print a helpful message.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-1-6',
        levelId: 'level-1',
        order: 6,
        title: 'APIs',
        subtitle: 'Connect Python to the internet',
        preClassBrief: [
          'What an API is — a door into another app\'s data',
          'How to use the requests library to call an API',
          'Reading JSON responses like a pro',
        ],
        classContent: 'We will call a real joke API live and display jokes in a beautifully formatted way.',
        taskTitle: 'Random Joke Generator',
        taskDescription: `
        Task 1:
        Build a "Random Joke Generator" that fetches real jokes from a free API (like icanhazdadjoke.com or jokeapi.dev) and displays them in a nicely formatted way. This is the first thing you can show your parents!

        Task 2 (Challenge):
        Extend the Joke Generator with a menu system. When the program starts, show three options: (1) New Joke — fetch and display a fresh joke, (2) Save Favorite Joke — save the last displayed joke to a favorites.txt file, (3) View Saved Jokes — read and display all previously saved jokes from favorites.txt. Keep the menu running until the user chooses to exit.
        `,
        taskXp: 200,
        isBossTask: true,
      },
    ],
  },
  {
    id: 'level-2',
    order: 2,
    title: 'AI Foundations',
    tagline: 'Understand what AI really is and start using it',
    color: 'blue',
    nodes: [
      {
        id: 'node-2-1',
        levelId: 'level-2',
        order: 1,
        title: 'What AI Actually Is',
        subtitle: 'Dispel myths, see real examples',
        preClassBrief: [
          'What AI is and what it is NOT (no robots taking over)',
          'The difference between AI, ML, and deep learning',
          'Real AI applications you already use every day',
        ],
        classContent: 'We will look at real AI demos together — image recognition, translation, recommendation systems — and understand exactly how they work under the hood.',
        taskTitle: 'AI Around Me',
        taskDescription: `
        Task 1:
        Write a 1-page report (in a .txt file) identifying 5 AI systems you use in daily life. For each one, explain: what data it was trained on, what it predicts/decides, and how it benefits you.

        Task 2 (Challenge):
        Choose one real AI company (e.g. OpenAI, Google DeepMind, Grammarly, or any other). Research and write a short profile covering: what problem the company solves, what data it uses to train its AI, and how it makes money from its product. Save your findings in the same .txt file as a new section.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-2-2',
        levelId: 'level-2',
        order: 2,
        title: 'Prompt Engineering',
        subtitle: 'Talk to AI like a professional',
        preClassBrief: [
          'Why the quality of your prompt determines the quality of the answer',
          'The anatomy of a great prompt: role, context, task, format',
          'Common prompting mistakes and how to avoid them',
        ],
        classContent: 'We will run live prompt experiments — same question, different prompts — and see how drastically the output changes. You will learn to engineer prompts like a pro.',
        taskTitle: 'Prompt Engineer Challenge',
        taskDescription: `
        Task 1:
        Take 3 school subjects. For each subject, write a BAD prompt and then an ENGINEERED prompt that gets a much better answer. Screenshot both results and explain what you changed and why.

        Task 2 (Challenge):
        Pick any one chapter from a subject you are currently studying. Write four separate engineered prompts for that chapter — one that generates detailed notes, one that creates a quiz with answers, one that produces a concise summary, and one that describes a mind map structure. Compare the four outputs and write a short reflection on which was most useful and why.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-2-3',
        levelId: 'level-2',
        order: 3,
        title: 'Using AI APIs',
        subtitle: 'Gemini/Groq — free tier, real power',
        preClassBrief: [
          'How to get a free Gemini API key from Google',
          'How to call the API from Python with requests',
          'Parsing the response and displaying it cleanly',
        ],
        classContent: 'We will call the Gemini API live and build a question-answering script together.',
        taskTitle: 'Smart Homework Helper',
        taskDescription: `
        Task 1:
        Build a "Smart Homework Helper" that takes any question from the user, sends it to the Gemini API, and displays a clean, formatted answer. This is something you can actually use for school!

        Task 2 (Challenge):
        Extend the Homework Helper with three answer modes. Before sending the question, ask the user to choose: (1) Explain Like I\'m 10 — gets a very simple, beginner-friendly answer, (2) Short Answer — gets a concise 2–3 sentence response, (3) Detailed Answer — gets a thorough, in-depth explanation. Pass the selected mode as part of the prompt to the API and display the result accordingly.
        `,
        taskXp: 200,
        isBossTask: true,
      },
      {
        id: 'node-2-4',
        levelId: 'level-2',
        order: 4,
        title: 'Understanding Data',
        subtitle: 'What AI eats and why it matters',
        preClassBrief: [
          'Why data is called "the food of AI"',
          'What training data, test data, and validation data are',
          'How biased data creates biased AI',
        ],
        classContent: 'We will explore a real dataset together, clean it up, and understand what makes data good or bad for training a model.',
        taskTitle: 'Data Detective',
        taskDescription: `
        Task 1:
        Download a free dataset from Kaggle (any topic you like). Write a Python script that loads it, prints basic stats (number of rows, columns, any missing values), and describes what an AI could learn from it.

        Task 2 (Challenge):
        Using the same dataset, brainstorm and document 3 possible AI projects that could realistically be built from it. For each project idea, describe: what the AI would predict or classify, what columns it would use as inputs, and who would benefit from the tool. Add this as a written section in your script output or a separate .txt file.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-2-5',
        levelId: 'level-2',
        order: 5,
        title: 'Fine-Tuning & Image Recognition',
        subtitle: 'See how AI learns from examples',
        preClassBrief: [
          'What fine-tuning means — teaching an AI new tricks',
          'How image recognition works at a high level',
          'Running a pre-trained model with just a few lines of code',
        ],
        classContent: 'We will run a live image recognition demo using a pre-trained model and see it classify objects in real photos.',
        taskTitle: 'Image Classifier',
        taskDescription: `
        Task 1:
        Use a free pre-trained model (like those in the transformers library or a simple TensorFlow demo) to classify 5 of your own photos. Show the predictions and explain if they were correct or why they were wrong.

        Task 2 (Challenge):
        Test the same model with three deliberately different types of images: a clear, well-lit image of an object, a blurry or low-quality version of a similar object, and an unusual or unexpected image (e.g. a drawing, a meme, or an object seen from a strange angle). Compare the model\'s confidence scores and accuracy across all three. Write a short conclusion about what affects the model\'s performance.
        `,
        taskXp: 50,
        isBossTask: false,
      },
    ],
  },
  {
    id: 'level-3',
    order: 3,
    title: 'Build Chatbots',
    tagline: 'Create bots that actually work and talk',
    color: 'purple',
    nodes: [
      {
        id: 'node-3-1',
        levelId: 'level-3',
        order: 1,
        title: 'Chatbot Logic',
        subtitle: 'How conversation flow works',
        preClassBrief: [
          'The state machine model — how a bot knows what to say next',
          'Intents, entities, and how to design a conversation',
          'The difference between rule-based and AI-powered bots',
        ],
        classContent: 'We will design a chatbot conversation flow on paper first, then build the Python logic that powers it.',
        taskTitle: 'Pizza Order Bot',
        taskDescription: `
        Task 1:
        Build a command-line chatbot that takes a pizza order. It should ask for size, crust, toppings, and delivery or pickup — then confirm the order back to the user. Use functions and if/else logic.

        Task 2 (Challenge):
        Extend the Pizza Order Bot with two new features. After showing the order confirmation, give the user the option to cancel the order entirely (which clears everything and exits) or modify the order (which lets them re-select any one item — size, crust, toppings, or delivery method — and then shows the updated confirmation).
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-3-2',
        levelId: 'level-3',
        order: 2,
        title: 'Telegram Bots',
        subtitle: 'Deploy on a real messaging platform',
        preClassBrief: [
          'How to create a Telegram bot with BotFather',
          'How the python-telegram-bot library works',
          'Handling commands and messages from real users',
        ],
        classContent: 'We will build and deploy a live Telegram bot together that responds to commands and messages.',
        taskTitle: 'Your First Telegram Bot',
        taskDescription: `
        Task 1:
        Create a Telegram bot that: (1) responds to /start with a welcome message, (2) responds to /joke with a random joke from an API, (3) echoes back any text the user sends. Share the bot username.

        Task 2 (Challenge):
        Extend your Telegram bot with an FAQ system. Add a /faq command that displays a list of common questions. When the user picks a question (by number or keyword), the bot replies with a pre-written custom answer. Add at least 5 FAQ entries covering topics relevant to your bot\'s theme.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-3-3',
        levelId: 'level-3',
        order: 3,
        title: 'Intelligent Bots with LLM',
        subtitle: 'Give your bot an AI brain',
        preClassBrief: [
          'How to connect your Telegram bot to the Gemini API',
          'Managing conversation history so the bot remembers context',
          'Rate limiting and handling API errors gracefully',
        ],
        classContent: 'We will upgrade our Telegram bot to use Gemini as its brain — making it able to answer any question intelligently.',
        taskTitle: 'AI Tutor Bot',
        taskDescription: `
        Task 1:
        Upgrade your Telegram bot to be an "AI Tutor Bot" — it connects to Gemini, remembers the last 5 messages of conversation, and can explain any concept in simple terms.

        Task 2 (Challenge):
        Add a subject selection feature to the AI Tutor Bot. When the user starts a session, ask them to choose a subject: Math, Science, or English. Based on their choice, customize the system prompt sent to Gemini so the bot responds in a style appropriate to that subject (e.g. step-by-step for Math, experiment-based for Science, grammar-focused for English). Allow the user to switch subjects at any time using a /subject command.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-3-4',
        levelId: 'level-3',
        order: 4,
        title: 'Bots with a Database',
        subtitle: 'Make your bot remember users',
        preClassBrief: [
          'Simple JSON-based storage for bot data',
          'How to save and load user preferences',
          'Firebase Realtime Database as a free cloud option',
        ],
        classContent: 'We will add a user database to our bot so it remembers each user\'s name and preferences across sessions.',
        taskTitle: 'Personalized Bot',
        taskDescription: `
        Task 1:
        Add persistent storage to your bot. When a user first messages it, ask for their name. Store it. On future messages, greet them by name. Also track how many times they\'ve used the bot.

        Task 2 (Challenge):
        Extend the user profile by collecting and storing three additional pieces of information during onboarding: the user\'s favorite subject, their age, and their learning goal (e.g. exam prep, general knowledge, skill building). Save all of this per user in your JSON or Firebase database. Display a personalized welcome summary whenever the user sends /profile.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-3-5',
        levelId: 'level-3',
        order: 5,
        title: 'Deploy Your Bot 24/7',
        subtitle: 'Make it live on the internet',
        preClassBrief: [
          'Why your bot dies when you close your laptop',
          'Free hosting options: Railway, Render, PythonAnywhere',
          'How to deploy in 10 minutes using Railway',
        ],
        classContent: 'We will deploy a working bot to Railway together and test it runs even when the laptop is off.',
        taskTitle: 'Customer Service Chatbot',
        taskDescription: `
        Task 1:
        Build and deploy a customer service chatbot for a fictional local shop (your choice). It must handle: product questions, prices, opening hours, and order status. Deploy it live. Share the Telegram link.

        Task 2 (Challenge):
        Before deploying, add an About section to your bot. When the user sends /about, the bot should display a short project description: what the bot does, who built it, which tools and APIs it uses, and a one-line tagline. This page acts as a public-facing project showcase that you can share with potential clients or on your portfolio.
        `,
        taskXp: 200,
        isBossTask: true,
      },
    ],
  },
  {
    id: 'level-4',
    order: 4,
    title: 'Automation & Apps',
    tagline: 'Build tools that solve real problems',
    color: 'orange',
    nodes: [
      {
        id: 'node-4-1',
        levelId: 'level-4',
        order: 1,
        title: 'Web Scraping',
        subtitle: 'Collect real data from the internet',
        preClassBrief: [
          'How websites serve HTML and how to extract data from it',
          'The BeautifulSoup and requests combo',
          'Ethical scraping — what\'s allowed and what\'s not',
        ],
        classContent: 'We will scrape a real product listing page together and extract prices, names, and ratings into a clean list.',
        taskTitle: 'Price Tracker',
        taskDescription: `
        Task 1:
        Build a price tracker that scrapes a product from any e-commerce site (Daraz, Amazon, etc.), saves the current price to a CSV file with a timestamp, and alerts you if the price dropped.

        Task 2 (Challenge):
        Extend the price tracker to run over multiple days (or simulate it by running the scraper several times manually). After collecting at least 5 data points, use matplotlib to generate a line chart showing the price trend over time, with dates on the x-axis and price on the y-axis. Save the chart as a .png file.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-4-2',
        levelId: 'level-4',
        order: 2,
        title: 'Workflow Automation',
        subtitle: 'n8n and simple automation logic',
        preClassBrief: [
          'What n8n is and why it\'s a superpower for builders',
          'Connecting apps without writing much code',
          'Real automation examples: auto-reply, data routing, notifications',
        ],
        classContent: 'We will build a working n8n workflow together that triggers on a form submission and sends a Telegram notification.',
        taskTitle: 'News Summarizer Bot',
        taskDescription: `
        Task 1:
        Build an automation that: fetches today\'s top tech headlines from an RSS feed or API, sends them through Gemini to get a 3-sentence summary, and posts the summary to your Telegram bot every morning.

        Task 2 (Challenge):
        Extend the automation to also deliver the daily news summary by email. Add an email node to your n8n workflow (using Gmail or SMTP) so that the same summary gets sent both to your Telegram bot and to a specified email address. Test both delivery channels and screenshot the results.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-4-3',
        levelId: 'level-4',
        order: 3,
        title: 'Build a Web App with UI',
        subtitle: 'Give your tools a face',
        preClassBrief: [
          'What Streamlit is and why it\'s perfect for Python developers',
          'How to turn a script into a proper web app',
          'Deploying to Streamlit Community Cloud for free',
        ],
        classContent: 'We will take the Homework Helper script from Level 2 and turn it into a beautiful Streamlit web app — with a text input, a submit button, and formatted output.',
        taskTitle: 'AI Web App',
        taskDescription: `
        Task 1:
        Pick your best project from earlier levels and rebuild it as a Streamlit web app with a proper UI. Deploy it on Streamlit Community Cloud. Share the public link.

        Task 2 (Challenge):
        Polish the web app with three UI improvements: add a logo or header image at the top of the page, add a sidebar that contains app information or user settings (such as selecting a mode or adjusting a parameter), and add a settings page or section where users can customize their experience. Redeploy and share the updated link.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-4-4',
        levelId: 'level-4',
        order: 4,
        title: 'GitHub Portfolio',
        subtitle: 'Publish everything you\'ve built',
        preClassBrief: [
          'What GitHub is and why every developer needs it',
          'Git basics: init, add, commit, push',
          'How to write a README that makes people want to try your project',
        ],
        classContent: 'We will create a GitHub account together, initialize repos for our best projects, and push them live.',
        taskTitle: 'GitHub Portfolio',
        taskDescription: `
        Task 1:
        Create a GitHub account and publish at least 3 of your projects from this course. Each repo must have a README explaining what the project does and how to run it. Share your GitHub profile link.

        Task 2 (Challenge):
        Go back and upgrade the README for each of your published repos. Each improved README must include: at least one screenshot or demo GIF of the project in action, a clear step-by-step installation and setup guide, and a features section listing the key capabilities of the project. A strong README is often the difference between someone starring your repo or moving on.
        `,
        taskXp: 200,
        isBossTask: true,
      },
    ],
  },
  {
    id: 'level-5',
    order: 5,
    title: 'Earn Online',
    tagline: 'Turn your skills into real income',
    color: 'yellow',
    nodes: [
      {
        id: 'node-5-1',
        levelId: 'level-5',
        order: 1,
        title: 'Fiverr & Upwork',
        subtitle: 'How the platforms actually work',
        preClassBrief: [
          'The difference between Fiverr and Upwork — which one to start with',
          'How the algorithm decides who gets clients',
          'What makes a profile stand out from day one',
        ],
        classContent: 'We will look at real winning profiles and gigs together — analyzing exactly what they do right and why clients hire them.',
        taskTitle: 'Profile Audit',
        taskDescription: `
        Task 1:
        Create accounts on both Fiverr and Upwork. Write your profile bio, add a profile picture, and list 3 skills you can offer based on what you\'ve built in this course. Screenshot both profiles.

        Task 2 (Challenge):
        Find 5 successful freelancer profiles on Fiverr or Upwork in the Python, AI, or automation niche. Study them carefully and document the common patterns you notice — things like how they write their bio, what keywords they use, how they present their skills, and what their profile picture looks like. Write your findings in a patterns.txt file with specific examples from each profile.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-5-2',
        levelId: 'level-5',
        order: 2,
        title: 'What Services to Offer',
        subtitle: 'Package your skills as gigs',
        preClassBrief: [
          'The 5 most in-demand AI/Python gigs for students',
          'How to price your first gig (not too low, not too high)',
          'What deliverables to promise and what NOT to promise',
        ],
        classContent: 'We will design a gig together from scratch — title, description, packages, and pricing.',
        taskTitle: 'Your First Gig',
        taskDescription: `
        Task 1:
        Create a complete Fiverr gig for one of these services: Telegram bot, Python automation script, AI-powered tool, or web scraper. Write the full description, set 3 packages, and publish it.

        Task 2 (Challenge):
        Brainstorm and document 3 distinct gig ideas based on different skills you\'ve developed in this course. For each gig idea, write: a catchy gig title, a one-paragraph service description, suggested pricing for basic, standard, and premium packages, and the ideal target client for that gig. Save all three in a gig-ideas.txt file.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-5-3',
        levelId: 'level-5',
        order: 3,
        title: 'Writing a Winning Proposal',
        subtitle: 'The proposal that gets replies',
        preClassBrief: [
          'Why 90% of proposals are ignored (and how to not be one of them)',
          'The 3-part structure: hook, fit, CTA',
          'Personalizing every proposal without spending hours on it',
        ],
        classContent: 'We will write 3 proposals live for real job postings on Upwork — and I will show you exactly what to say.',
        taskTitle: 'Proposal Practice',
        taskDescription: `
        Task 1:
        Find 3 real job postings on Upwork related to what you can do. Write a proper proposal for each one using the 3-part structure from class. Save them in a proposals.txt file (you don\'t have to send them yet).

        Task 2 (Challenge):
        Take your 3 proposals and rewrite each one for a different type of client. For example, if the original was for a startup, rewrite it for a small local business owner; if it was for a tech-savvy client, rewrite it for someone non-technical. Focus on adjusting the tone, vocabulary, and specific pain points you address. Save the rewritten versions alongside the originals in proposals.txt with clear labels.
        `,
        taskXp: 50,
        isBossTask: false,
      },
      {
        id: 'node-5-4',
        levelId: 'level-5',
        order: 4,
        title: 'Your First Client',
        subtitle: 'From pitch to delivery',
        preClassBrief: [
          'How to communicate with a client professionally',
          'Managing scope creep — knowing when to say "that\'s extra"',
          'Delivering work and asking for a review',
        ],
        classContent: 'We will role-play a full client interaction together — from first message to final delivery.',
        taskTitle: 'First Income or Full Portfolio',
        taskDescription: `
        Task 1:
        Complete ONE of: (A) Land a real gig and deliver it — screenshot the order and the 5-star review. OR (B) Publish a complete portfolio with 5 projects on GitHub + a Streamlit portfolio site. Both count as course completion.

        Task 2 (Challenge):
        Create a portfolio presentation (PDF or Canva slides) that showcases all the projects you built during this course. For each project include: a title and one-line description, a screenshot or demo link, the tools and technologies used, and what problem it solves. Design it as if you were presenting to a potential client or employer. Share the final PDF or public link.
        `,
        taskXp: 200,
        isBossTask: true,
      },
    ],
  },
]

export const ALL_NODES = LEVELS.flatMap(l => l.nodes)

export function getNode(nodeId: string) {
  return ALL_NODES.find(n => n.id === nodeId)
}

export function getLevel(levelId: string) {
  return LEVELS.find(l => l.id === levelId)
}

export function getLevelColor(color: string) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    green: { bg: '#d1fae5', text: '#047857', border: '#a7f3d0' },
    blue: { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' },
    purple: { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff' },
    orange: { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' },
    yellow: { bg: '#fef3c7', text: '#b45309', border: '#fcd34d' },
  }
  return map[color] ?? map.blue
}

export const BADGES: { id: string; title: string; description: string; icon: string; color: string }[] = [
  { id: 'first-code', title: 'First Code', description: 'Completed your very first node', icon: '💻', color: 'text-emerald-400' },
  { id: 'bug-slayer', title: 'Bug Slayer', description: 'Submitted after fixing an error', icon: '🐛', color: 'text-red-400' },
  { id: 'speed-run', title: 'Speed Run', description: 'Submitted within 12 hours of task release', icon: '⚡', color: 'text-yellow-400' },
  { id: 'on-a-roll', title: 'On a Roll', description: 'Maintained a 5-day streak', icon: '🔥', color: 'text-orange-400' },
  { id: 'ai-whisperer', title: 'AI Whisperer', description: 'Completed Level 2 — AI Foundations', icon: '🤖', color: 'text-blue-400' },
  { id: 'bot-builder', title: 'Bot Builder', description: 'Completed Level 3 — Build Chatbots', icon: '🤝', color: 'text-purple-400' },
  { id: 'open-source', title: 'Open Source', description: 'Pushed first project to GitHub', icon: '🐙', color: 'text-gray-300' },
  { id: 'level-1-done', title: 'Pythonista', description: 'Completed Level 1 — Python Kickstart', icon: '🐍', color: 'text-emerald-400' },
  { id: 'level-4-done', title: 'Automator', description: 'Completed Level 4 — Automation & Apps', icon: '⚙️', color: 'text-orange-400' },
  { id: 'course-done', title: 'BuildAI Grad', description: 'Completed the entire BuildAI Academy course', icon: '🎓', color: 'text-amber-400' },
]

export const XP_VALUES = {
  node: 50,
  bossTask: 200,
  levelBonus: 100,
  attendance: 10,
  earlySubmission: 25,
}