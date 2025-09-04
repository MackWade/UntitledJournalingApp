## Presentation link


# Galatic Journal App

Galactic Journal is an AI-powered application designed to help those who struggle to maintain a consistent journaling habit, featuring a friendly AI companion named Spacey that guides users by offering suggestions and motivation. The app allows you to easily create, edit, and manage entries while using secure AI analytics to provide weekly progress insights that encourage further reflection. Prioritizing your privacy, all journal data is stored locally on your device, and the AI is carefully designed to only process prompt recommendations while avoiding any sensitive personal topics.


## Features

- **Smart Journaling**: Create, edit, and manage journal entries with rich text support
- **AI-Powered Insights**: Get personalized writing prompts and sentiment analysis
- **Analytics Dashboard**: Track your writing patterns, themes, and mood trends
- **Calendar Integration**: Visualize your journaling activity with weekly/monthly views
- **Local Storage**: All data stored locally for privacy and security


## Future Enhancements

In the future I would like to: 
- **Integrate a powerful LLM**: Transition from the current limited mock LLM to a high-performance language model to enable deeper and more meaningful analytics.
- **Expand chatbot training data**: Enhance Spacey (the AI chatbot) with additional training to responsibly handle sensitive topics and support more nuanced, complex conversations.
- **Improve the analytics dashboard**: Improve the existing dashboard with more detailed metrics and visualizations to provide users with clearer insights into their progress.
- **Redesign the journaling UI:** Create a more inviting and modern user interface by incorporating contemporary design elements and applying further UI/UX research.



## Development disclamers

### Use of AI on project

Throughout the development of this project, I leveraged AI as an assistive tool to enhance productivity in specific areas. It was instrumental in refactoring and reorganizing React code, as well as in debugging logic, visual rendering issues. I also used it to generate a foundational structure for the project's README documentation generating mock code. The core architecture, design, and implementation of the application, however, were entirely my own work.To create a point of contact for users, I integrated a Zapier AI chatbot, which was intentionally constrained to provide only safe, pre-approved journal prompts. Its training data and directives are designed to prevent harmful outputs and to gently steer conversations back toward positive and productive reflection if the user attempts to go off-topic.On the backend, all user journal data is stored locally, ensuring complete privacy and security, as sensitive information never leaves the user's device.A technical note: due to resource constraints, I was unable to integrate a full-scale large language model (LLM) like ChatGPT. Instead, I developed a mock LLM, which means the chatbot's responses are functional but limited. Access to a more powerful LLM would significantly improve the depth of conversational analytics and user interaction.


## Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 16.0 or higher)
- **npm** (version 7.0 or higher) or **yarn**
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UntitledJournalingApp/journaling-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## Development Setup

### Project Structure

```
src/
├── app/                 # Main app configuration
├── components/          # Reusable UI components
├── pages/              # Main application pages
│   ├── CalendarView.jsx    # Calendar and analytics view
│   ├── JournalEntry.jsx    # Individual journal entry editor
│   ├── JournalList.jsx     # List of all journal entries
│   └── AIView.jsx          # AI insights and prompts
├── utils/              # Utility functions
│   ├── aiAnalysis.js       # AI analysis functions
│   └── SideNavBar.jsx      # Navigation component
├── assets/             # Static assets
└── types/              # TypeScript type definitions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file in the root directory for any environment-specific configurations:

```env
# Example environment variables
VITE_APP_NAME="Untitled Journaling App"
VITE_APP_VERSION="1.0.0"
```

## Usage Guide

### Creating Your First Entry

1. Click the **"+"** button in the bottom right corner
2. Add a title and start writing your journal entry
3. Use the emoji picker to add mood indicators
4. Add tags to categorize your entries
5. Click **"Save Entry"** to store your entry

### Using AI Features

1. Navigate to the **Calendar** view to see AI insights
2. View your **sentiment analysis** and **writing themes**
3. Get **personalized prompts** based on your writing patterns
4. Track your **writing streak** and **weekly/monthly summaries**

### Calendar View

- Switch between **Weekly** and **Monthly** views
- Click on dates to see entries for that day
- View comprehensive analytics and insights
- Get AI-powered reflections and summaries

## Customization

### Styling

The app uses Material-UI for styling. 


## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill the process using port 5173
npx kill-port 5173
# or use a different port
npm run dev -- --port 3000
```

**Dependencies not installing**
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors**
```bash
# Check for linting errors
npm run lint
# Fix auto-fixable issues
npm run lint -- --fix
```

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Material-UI](https://mui.com/)
- Bundled with [Vite](https://vitejs.dev/)
- Icons from [Material Icons](https://fonts.google.com/icons)
