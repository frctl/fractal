# How to Release

1. Remove `node_modules` and `package-lock.json` in preparation to update the
   transient dependencies

        rm -rf node_modules/ package-lock.json example/node_modules/ package-lock.json

2. Update dependencies using `ncu`

        ncu -i

3. Increase version number in `package.json` and run `npm install` to update
   `package-lock.json`

4. Run `npm install` in `example/` directory to update `package-lock.json` there
   as well

        cd example/
        npm install
        cd ..

5. Test and compile assets

        npm test
        npm run compile-assets

6. Ensure that CHANGELOG lists all relevant changes and update CHANGELOG with
   new version number

7. commit as "v#.#.#"

        $ git commit -m "v`node -p -e 'require("./package.json").version'`"

8. tag as "v#.#.#"

        $ git tag -am "v`node -p -e 'require("./package.json").version'`" \
                "v`node -p -e 'require("./package.json").version'`"

9. publish

        npm publish

10. push to git

        $ git push --follow-tags
