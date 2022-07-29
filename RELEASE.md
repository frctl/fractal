# How to Release

1. update dependencies (`ncu -i`)

2. Increase version number in `package.json` and run `npm install` to update
   `package-lock.json`

3. Update CHANGELOG with new version number

4. Test and compile assets

        npm test
        npm run compile-assets

5. commit as "v#.#.#"

        $ git commit -m "v`node -p -e 'require("./package.json").version'`"

6. tag as "v#.#.#"

        $ git tag -am "v`node -p -e 'require("./package.json").version'`" \
                "v`node -p -e 'require("./package.json").version'`"

7. publish

        npm publish

8. push to git

        $ git push --follow-tags
