### Create a remote repo
* On github.com, make a new rep (WITHOUT A README)
* Go to Code->SSH and copy the https://github.com/AJ-Work-Smoothie/Notebook.git
### Initialize the repo
* cd path/to/your/project
* `git init`
### Stage and commit everything
* `git add .`
* `git commit -m "First Commit Message"`
### Connect Github & push
* `git branch -M main`
* `git remote add origin <ssh address>`
* `git push -u origin main`
##### If it doesn't upload, it's because you already have file. Erase them and force upload with `--force` as an arg on `git push`

# Mananging Branches

1. Navigate to your root directory
2. Bash `git checkout -b branchName`. The `-b <branchname` makes a new branch and switches you onto it
3. Add changes by `git add .` and then commit them with `git commit -m "Commit Message"`
4. Push the branch to Github: `git push -u origin branchname`. `branchname` can also be `main`. The `-u` sets the `origin/branchname` as the default remote for future `git push`/`git pull`. 
5. Merge changes (you can do this easily online or)
    `git checkout main`
    `git pull`
    `git merge branchname`
    `git push origin main`
6. Delete the local branch `git branch -d branchName`
    If you didnt' delete on Github online, drop the remote reference: `git push origin --delete branchName`
    `git fetch --prune` deletes any local branch that doesn't show online
