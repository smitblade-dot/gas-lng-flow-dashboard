# Turning on daily automation for the gas & LNG site

This makes the site refresh itself every day — Claude runs on GitHub's own
servers, checks for real developments, and pushes `data.json` itself when
something's actually changed. Cost: this draws on your existing Claude Pro
subscription's usage allowance, same pool as your normal chats — not a
separate bill.

This is the same mechanism used for the companion crude-flow dashboard's
site, just pointed at this repo instead.

## Step 1 — Generate a Claude Code subscription token

(Skip this if you already did it for the crude-flow dashboard's repo and
still have the token saved somewhere safe — you can reuse the same token
as a secret in this repo too, since it's tied to your subscription, not to
one repo.)

1. Open the Claude desktop app → the **Code** tab (next to Chat and
   Cowork).
2. Start a session with **Environment: Local** (any folder is fine).
3. Open its integrated terminal and run:

   ```
   claude setup-token
   ```

4. It opens your browser to confirm you're authorizing your own Pro
   subscription, then prints a token in the terminal. Copy it.

## Step 2 — Install the Claude GitHub App on your repo

1. Go to **github.com/apps/claude** → **Install** (or **Configure** if
   it's already installed from the crude-flow dashboard).
2. **Only select repositories** → make sure your gas/LNG repo (e.g.
   `gas-lng-flow-dashboard`) is ticked, alongside any others → **Save**.

## Step 3 — Add the token as a repository secret

1. In this repo → **Settings** → **Secrets and variables** → **Actions**.
2. **New repository secret**.
3. Name: `CLAUDE_CODE_OAUTH_TOKEN`
4. Value: paste the token from Step 1.
5. **Add secret**.

## Step 4 — Add the automation files

Upload these two files from this bundle, keeping the folder structure:

- `CLAUDE.md` → repo **root** (next to `index.html`)
- `.github/workflows/daily-data-refresh.yml` → a `.github/workflows/`
  folder (GitHub's upload will create the folders if you drop in the whole
  path, or use **Add file → Create new file** and type the path with
  slashes)

Commit.

## Step 5 — Test it without waiting a day

1. Repo → **Actions** tab → **Daily gas & LNG flow data refresh** (left list).
2. **Run workflow** → **Run workflow** to confirm.
3. Watch it run (a couple of minutes). Check `data.json`'s commit history
   afterwards to see whether it found anything and updated the timestamp.

If it fails, click into the run for the error — usually the secret name
being slightly off, or the GitHub App not having access to this repo yet.

## Reminder

Turning this off later, or changing the schedule, is just editing or
deleting `.github/workflows/daily-data-refresh.yml` — no rebuild needed.
