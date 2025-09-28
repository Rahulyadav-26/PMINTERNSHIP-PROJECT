# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/7cef41cb-bdd8-4a9c-a124-49f22b077321

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7cef41cb-bdd8-4a9c-a124-49f22b077321) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Application Process Features

The student application workflow includes:

- Online application form with dynamic validation
- Bulk application for multiple opportunities
- Application status tracking with timeline and notifications
- Deadline management with reminders
- Draft saving and resume management

### Usage

- Go to Dashboard > Recommendations
  - Select one or more opportunities and click:
    - Apply to open the form, or
    - Bulk Apply to submit the same form to all selected.
- While filling the form:
  - Confirm required skills (dynamic checkboxes based on the opportunity)
  - Provide a cover letter and preferred start date
  - Save Draft at any time (auto-saves as you type)
  - Manage resume from the Resume page
- After submitting:
  - Track progress in Dashboard > Applications (timeline shown)
  - You’ll receive in-app toasts for changes. Enable browser notifications to also get OS-level alerts.

Notes:
- Data is persisted locally in your browser (no backend yet). Deleting site data will clear it.
- Reminders work while the app is open; background reminders require a backend or PWA push setup.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7cef41cb-bdd8-4a9c-a124-49f22b077321) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
