cd "${0%/*}"
cp static/* ../../_dist/client
npx tsc --watch