# GitHub Setup Guide for VivaSec

This guide will help you push your VivaSec source code to GitHub.

## Prerequisites

- GitHub account (create one at https://github.com if you don't have one)
- Git installed on your machine
- SSH key or Personal Access Token configured with GitHub

## Step-by-Step Instructions

### Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Enter repository name: `vivasec`
3. Add description: "VivaSec - Unified Privacy Super-App"
4. Choose visibility: **Public** (to share with others) or **Private** (for personal use)
5. Do NOT initialize with README (we already have one)
6. Click "Create repository"

### Step 2: Configure Git Locally

Open your terminal and navigate to the VivaSec project:

```bash
cd /home/ubuntu/vivasec
```

Configure your git credentials (if not already done):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Add Remote Repository

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/vivasec.git
```

Or if using SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/vivasec.git
```

### Step 4: Verify Remote Configuration

```bash
git remote -v
```

You should see:
```
origin  https://github.com/YOUR_USERNAME/vivasec.git (fetch)
origin  https://github.com/YOUR_USERNAME/vivasec.git (push)
```

### Step 5: Push Code to GitHub

Push your code to the main branch:

```bash
git branch -M main
git push -u origin main
```

### Step 6: Verify Upload

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/vivasec`
2. Verify that all files are uploaded
3. Check that the README.md is displaying correctly

## Files Included in Repository

```
vivasec/
├── README.md                 # Project documentation
├── GITHUB_SETUP.md          # This file
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── drizzle.config.ts        # Database configuration
│
├── client/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── VivaChat.tsx
│   │   │   ├── VivaSurf.tsx
│   │   │   ├── VivaConnect.tsx
│   │   │   ├── VivaMail.tsx
│   │   │   └── VivaVault.tsx
│   │   ├── components/      # Reusable components
│   │   ├── lib/             # Utilities
│   │   ├── contexts/        # React contexts
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html           # HTML template
│   └── public/              # Static assets
│
├── server/
│   ├── routers.ts           # tRPC procedure definitions
│   ├── db.ts                # Database query helpers
│   ├── auth.logout.test.ts  # Test example
│   └── _core/               # Framework core files
│
├── drizzle/
│   ├── schema.ts            # Database schema
│   └── migrations/          # Database migrations
│
├── shared/
│   ├── const.ts             # Shared constants
│   └── types.ts             # Shared types
│
├── storage/
│   └── index.ts             # S3 storage helpers
│
└── .gitignore               # Git ignore rules
```

## Important Notes

### Environment Variables

**DO NOT commit `.env` files to GitHub!** They contain sensitive information.

The `.gitignore` file already excludes:
- `.env`
- `.env.local`
- `.env.*.local`
- `node_modules/`
- `dist/`
- `.vscode/`

### Sensitive Information

Never commit:
- Database credentials
- API keys
- OAuth secrets
- Private keys
- Personal information

### First-Time Setup for Collaborators

When others clone your repository, they need to:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/vivasec.git
cd vivasec

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local

# Add your configuration to .env.local
# DATABASE_URL=...
# JWT_SECRET=...
# etc.

# Initialize database
pnpm db:push

# Start development server
pnpm dev
```

## Pushing Updates

After making changes locally:

```bash
# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

## Branching Strategy (Optional)

For better collaboration, use feature branches:

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git add .
git commit -m "Add amazing feature"

# Push feature branch
git push origin feature/amazing-feature

# Create Pull Request on GitHub
# Then merge to main when approved
```

## Troubleshooting

### Authentication Issues

If you get authentication errors:

1. **Using HTTPS**: Create a Personal Access Token
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Generate new token with `repo` scope
   - Use token as password when prompted

2. **Using SSH**: Add SSH key to GitHub
   - Generate key: `ssh-keygen -t ed25519 -C "your.email@example.com"`
   - Add public key to GitHub Settings > SSH and GPG keys

### Existing Remote Error

If you get "fatal: remote origin already exists":

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/vivasec.git
```

### Large Files

If you have files larger than 100MB, GitHub will reject them. Use Git LFS:

```bash
git lfs install
git lfs track "*.large-file"
git add .gitattributes
git push
```

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Configure local git
3. ✅ Push code to GitHub
4. Add GitHub Actions for CI/CD
5. Set up branch protection rules
6. Configure deployment automation
7. Add contributing guidelines
8. Create issue templates

## Resources

- GitHub Docs: https://docs.github.com
- Git Cheat Sheet: https://github.github.com/training-kit/downloads/github-git-cheat-sheet.pdf
- VivaSec Documentation: See README.md

---

**Questions?** Check GitHub documentation or create an issue in your repository.
