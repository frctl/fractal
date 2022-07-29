# How to Release

1. update dependencies (`ncu -i`)

2. Increase version number in `package.json` and run `npm install` to update
   `package-lock.json`

3. Update CHANGELOG with new version number

4. commit as "v#.#.#"

        $ git commit -m "v`node -p -e 'require("./package.json").version'`"

3. tag as "v#.#.#"

        $ git tag -am "v`node -p -e 'require("./package.json").version'`" \
                "v`node -p -e 'require("./package.json").version'`"

4. publish

        npm test
        npm run compile-assets
        npm publish

5. push to git

        $ git push --follow-tags
