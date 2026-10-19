# Deploying PLC Textbook to GitHub Pages

This project is configured for automatic deployment to GitHub Pages via GitHub Actions.

## Live URL

```
https://hoang-vnu-is.github.io/plc-textbook/
```

---

## One-time Setup

### 1. Create the GitHub Repository

1. Go to https://github.com/new
2. Set **Repository name** to `plc-textbook`
3. Set visibility to **Public** (required for free GitHub Pages)
4. **Do NOT** initialize with README, .gitignore, or license (the project already has these)
5. Click **Create repository**

### 2. Push the Local Code

From the project root, run:

```bash
git remote add origin https://github.com/hoang-vnu-is/plc-textbook.git
git branch -M master
git push -u origin master
```

### 3. Enable GitHub Pages

1. Open the repository on GitHub
2. Go to **Settings → Pages** (left sidebar)
3. Under **Build and deployment → Source**, select **GitHub Actions**
4. Save

The first deployment will start automatically once you push to `master`. Subsequent pushes will trigger re-deployment.

---

## How it Works

| Component | Role |
|-----------|------|
| `next.config.mjs` | Sets `basePath` and `assetPrefix` from `NEXT_PUBLIC_BASE_PATH` env var |
| `src/lib/asset.ts` | `asset()` helper prepends base path to public-folder references |
| `.github/workflows/deploy.yml` | Builds with `NEXT_PUBLIC_BASE_PATH=/plc-textbook`, uploads `./out` to Pages |

### Build locally with production settings

```powershell
$env:NODE_ENV='production'; $env:NEXT_PUBLIC_BASE_PATH='/plc-textbook'; npm run build
```

The static output is written to `./out/`.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Blank page (HTML loads, CSS/JS 404) | Missing `basePath` / `assetPrefix` | Ensure `next.config.mjs` reads `NEXT_PUBLIC_BASE_PATH` |
| Images 404 | `<img src>` bypasses `assetPrefix` | Use `asset('/images/foo.png')` from `src/lib/asset.ts` |
| Workflow not triggered | Branch mismatch | Confirm default branch is `master` in GitHub repo settings |
