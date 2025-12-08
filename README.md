# GitHub Actions for Playwright Tests

This project uses GitHub Actions to automatically run Playwright tests and publish the HTML report to GitHub Pages.

## Workflow Overview

The workflow (`.github/workflows/playwright.yml`) runs on:
- **Push** to the `main` branch
- **Pull requests** targeting the `main` branch
- **Manual trigger** via the Actions tab
  - You can select any branch to run tests on
  - Default branch is `main`

### Jobs

#### 1. Test Job
- Runs in Microsoft's official Playwright Docker container (`mcr.microsoft.com/playwright:v1.57.0-noble`)
- Browsers are pre-installed in the container (no installation step needed)
- Sets up Node.js 20 and pnpm
- Implements pnpm store caching for faster dependency installation
- Installs dependencies with `--frozen-lockfile` for reproducibility
- Runs all Playwright tests with automatic retry (2 attempts) for failed tests
- Captures video, screenshots, and traces for all test runs
- Uploads test results (videos, traces, screenshots) as artifacts
- Uploads the HTML report as an artifact

#### 2. Deploy Job
- Downloads the test report artifact
- Deploys the HTML report to GitHub Pages
- Runs even if tests fail (using `if: always()`)

## Setup Instructions

### Enable GitHub Pages

1. Go to your repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the settings

That's it! The workflow will automatically deploy reports on the next run.

### View Reports

After the workflow runs, your Playwright report will be available at:
```
https://<your-username>.github.io/<repository-name>/
```

You can find the exact URL in the workflow run logs or in the Pages settings.

## Running Tests Manually

You can manually trigger the workflow on any branch:

1. Go to the **Actions** tab in your repository
2. Click **Playwright Tests** workflow
3. Click **Run workflow** button
4. Enter the branch name you want to test (e.g., `feature/new-login`, `develop`, `main`)
5. Click **Run workflow**

This is useful for:
- Testing feature branches before merging
- Running tests on specific commits
- Debugging issues on any branch

## Local Testing

Run tests locally using:
```bash
pnpm test:e2e
```

View the HTML report locally:
```bash
pnpm test:report
```

## Workflow Features

- ✅ Automatic test execution on push/PR
- ✅ Microsoft Playwright Docker image with pre-installed browsers
- ✅ pnpm dependency caching for faster builds
- ✅ **Video recording for all test runs**
- ✅ **Trace collection for all test runs**
- ✅ **Screenshot capture for all test runs**
- ✅ **Automatic retry (2 attempts) for failed tests**
- ✅ HTML report generation
- ✅ GitHub Pages deployment
- ✅ Test artifacts (videos, traces, screenshots) retained for 30 days
- ✅ Concurrency control to prevent multiple deployments
- ✅ Proper permissions for Pages deployment
- ✅ Console output with list reporter for CI visibility

## Accessing Test Artifacts

After each workflow run, you can download debugging artifacts:

1. Go to the **Actions** tab in your repository
2. Click on a workflow run
3. Scroll to the **Artifacts** section at the bottom
4. Download:
   - **test-results**: Contains videos, traces, and screenshots for all tests
   - **playwright-report**: HTML report for viewing in browser

### Viewing Traces

To view trace files locally:
```bash
npx playwright show-trace path/to/trace.zip
```

This opens an interactive trace viewer showing:
- Network requests
- Console logs
- DOM snapshots
- Screenshots at each step
- Timing information

## Troubleshooting

### Workflow fails with permissions error
Ensure the workflow has the correct permissions in your repository settings:
- Go to **Settings** → **Actions** → **General**
- Under **Workflow permissions**, select **Read and write permissions**

### Pages deployment fails
- Verify GitHub Pages is enabled in repository settings
- Check that the source is set to **GitHub Actions**
- Ensure the repository is public (or you have GitHub Pro/Enterprise for private repos)

### Tests fail in CI but pass locally
- Check environment variables (`.env` file is not available in CI by default)
- Verify browser compatibility
- Review the uploaded test artifacts for detailed logs
