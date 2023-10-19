
# next transcript tool
This application is a cutting-edge financial information platform powered by artificial intelligence. It delivers in-depth financial analysis and valuable insights, harnessing the power of earnings call transcripts. By examining these transcripts, it aids users in evaluating the fundamental risks and trends associated with companies. Furthermore, users have the ability to create their own inquiries and glean insights from meeting records.

## Features
- User authentication via Google and GitHub OAuth.
- Built with [Next.js](https://nextjs.org/) and React, styled with [Tailwind CSS](https://tailwindcss.com/) for a responsive UI.
- Integrates [OpenAI API](https://platform.openai.com/docs/api-reference) for advanced AI capabilities.
- Utilizes [Supabase](https://supabase.com/) for scalable database management.

## Demo


https://github.com/tyc67/next-transcipt-tool/assets/114332515/9f99ffd4-e3d4-414c-9b3b-b61b34453e98




## Technologies and Tools
- **Frontend:** Next.js, React, Tailwind CSS, heroicons
- **Backend:** Node.js
- **Database:** Supabase
- **Authentication:** Google OAuth, GitHub OAuth
- **API Integration:** OpenAI API, lang-chain
- **Version Control:** Git, GitHub
- **Documentation:** Markdown
- **Deployment:** Vercel
- **Code Quality:** ESLint, Prettier

## Getting Started

### Setting Up Environment Variables Locally
you'll need to set up environment variables for various configurations. 
Follow these steps:

1. Create a `.env.local` file in the root directory of your project if it doesn't already exist.
2. Add your environment variables to this file in the following format, replacing `API_KEY`, `SECRET_KEY`, and other variable names as needed:

   ```env
   # Supabase Config
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=

   # Get service key 
   OPENAI_KEY=
   ALPHA_VANTAGE_KEY=

   # Providers
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=

   # NextAuth Config
   NEXTAUTH_SECRET=
   NEXTAUTH_URL=
   
3. Make sure to add `.env.local` to your `.gitignore` file to prevent accidentally committing sensitive information to your version control system.
Once you've set up the environment variables, you can run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deploy on Vercel

To deploy your project on Vercel, follow these steps:

1. [Create a Vercel account](https://vercel.com/) if you don't have one, or log in if you already do.
2. Click the "Add New Project" button, and "import" your project's repository from GitHub.
3. Configure deployment settings, including environment variables if needed.
4. Deploy your project.

## Roadmap
- Improve data visualization with interactive charts.
- Add support for more languages with internationalization.
- Implement machine learning for predictive analytics.
- Implement user notifications for real-time updates.
