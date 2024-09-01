str="no comments"
git ls-files --modified | xargs git add
git ls-files --deleted | xargs git rm
git add -A
if [ ! -z "$1" -a "$1" != " " ]; then
        str=$1
fi
git commit -m "$str"

git push -u origin main