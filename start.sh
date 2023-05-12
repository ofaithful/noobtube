git fetch --all

remote_branch="origin/master"
local_branch="master"

remote_latest_commit_date=$(git log --pretty=format:%cd -n 1 $remote_branch --date=iso)
local_latest_commit_date=$(git log --pretty=format:%cd -n 1 $local_branch --date=iso)

remote_latest_commit_date_seconds=$(date -d "$remote_latest_commit_date" +%s)
local_latest_commit_date_seconds=$(date -d "$local_latest_commit_date" +%s)

dir="./dist"
# check if dist dir exists
if [ -d $dir ] && [ "$(ls -A $dir)" ]; then
    dist_dir_exists=true
else
    dist_dir_exists=false
fi

# check if need to pull
if [ $remote_latest_commit_date_seconds -gt $local_latest_commit_date_seconds ]; then
    need_to_pull=true
else
    need_to_pull=false
fi

if [ $need_to_pull = true ]; then
    echo -e "\033[32m"$remote_branch"\033[0m" "is ahead of" "\033[33m"$local_branch"\033[0m"
    git pull
fi

if [ $dist_dir_exists = false ] || [ $need_to_pull = true ]; then
    npx nx docker-build rest-api & npx nx docker-build user & npx nx docker-build video

    secondsToWait=5
    count=4

    while [ $count -ge 0 ]
    do
        printf "\rwaiting $secondsToWait seconds: $s" "$count"
        echo -n " $count"
        ((count--))
        sleep 1
    done
    echo -e "\n"
fi

docker-compose up