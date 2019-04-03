set -e
cd site
bundle exec jekyll build -d ../content_tmp
# Remove dangling references to the DejaVu fonts in the Javadoc stylesheets
sed -i "" "/^@import.*dejavu.css/d; s/'DejaVu[^']*',//g" ../content_tmp/javadoc/*/stylesheet.css
COMMIT_HASH=`git rev-parse HEAD`
cd ..
git checkout asf-site
rm -rf content
mv content_tmp content
git add content
echo "Committing changes to asf-site branch from master branch"
git commit -m "from $COMMIT_HASH"
echo "You are now on the asf-site branch"
echo "Run git push origin asf-site to update the live site."
set +e
