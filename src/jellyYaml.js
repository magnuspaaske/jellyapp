// Functions in connection with the project yaml file

const fs = require('fs');
const yaml = require('js-yaml');

// Read jelly.yaml
module.exports.readJellyYaml = () => {
    return yaml.load(fs.readFileSync(`${process.cwd()}/jelly.yaml`));
};

// Write jelly.yaml
module.exports.writeJellyYaml = (jelly) => {
    fs.writeFileSync(`${process.cwd()}/jelly.yaml`, yaml.dump(jelly));
};
