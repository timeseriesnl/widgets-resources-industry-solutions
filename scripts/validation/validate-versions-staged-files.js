const { join, dirname } = require("path");
const { promisify } = require("util");
const { exec, execFile } = require("child_process");

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

preCommit().catch(error => {
    console.error(error);
    process.exit(1);
});

async function preCommit() {
    const [{ stdout: lernaPackages }, { stdout: stagedFiles }] = await Promise.all([
        execAsync("npx lerna ls --json --all"),
        execAsync("git diff --staged --name-only")
    ]);
    const packages = JSON.parse(lernaPackages.trim());
    const staged = stagedFiles.trim().split("\n");
    const changedWidgetPackages = packages
        .filter(({ location }) =>
            staged.some(
                changedFilePath =>
                    dirname(join(process.cwd(), changedFilePath)).includes(location) &&
                    changedFilePath
                        .split("/")
                        .pop()
                        .match(/package\.(json|xml)$/)
            )
        )
        .filter(({ location }) => location.match(/(pluggable|custom)Widgets/));

    if (changedWidgetPackages.length) {
        const validationPromises = [];

        for (const changedWidgetPackage of changedWidgetPackages) {
            validationPromises.push(
                new Promise((resolve, reject) => {
                    execFileAsync("node", [join(process.cwd(), "scripts", "validation", "validate-version.js")], {
                        cwd: changedWidgetPackage.location
                    })
                        .then(() => resolve())
                        .catch(error => reject(error));
                })
            );
        }

        const validationResults = await Promise.all(
            validationPromises.map(promise => promise.catch(error => error.message.split("\n")[1]))
        );

        const failedResults = validationResults.filter(result => result);

        for (const error of failedResults) {
            console.error(error);
        }

        if (failedResults.length) {
            throw new Error("Widget version validation failed. See above for details.");
        }
    }
}
