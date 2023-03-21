const _ = require('lodash');
const { execSync } = require('child_process');
const fs = require('fs');

// Function to install dependencies on yarn
module.exports.installYarnDeps = (yarnDeps, flag) => {
    if (flag) {
        execSync(`yarn add --${flag} ${yarnDeps.join(' ')}`);
    } else {
        execSync(`yarn add ${yarnDeps.join(' ')}`);
    }
};

// Update scripts in package.json
module.exports.updatePkgScripts = (newScripts) => {
    const cwd = process.cwd();

    // Reading package sync
    const projectPkg = JSON.parse(
        fs.readFileSync(`${cwd}/package.json`),
        'utf8'
    );

    console.log('Setting up scripts');
    if (typeof projectPkg.scripts !== 'object') projectPkg.scripts = {};
    _(newScripts).each((val, key) => {
        projectPkg.scripts[key] = val;
    });

    console.log('Writing new package.json');
    fs.writeFileSync(
        `${cwd}/package.json`,
        JSON.stringify(projectPkg, null, 2)
    );
};
