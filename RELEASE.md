# How to Release

1. Test and compile assets

        npm test
        npm run compile-assets

2. Increase version number in `package.json` and run `npm install` to update
   `package-lock.json`

3. Update CHANGELOG with new version number

4. commit as "v#.#.#"

        $ git commit -m "v`node -p -e 'require("./package.json").version'`"

5. tag as "v#.#.#"

        $ git tag -am "v`node -p -e 'require("./package.json").version'`" \
                "v`node -p -e 'require("./package.json").version'`"

6. publish

        npm publish

7. push to git

        $ git push --follow-tags
