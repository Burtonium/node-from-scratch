process.env.NODE_ENV = 'test';
const Mocha = require('mocha');
const mocha = new Mocha(); // jshint ignore:line
const fs = require('fs');
const path = require('path');
const testDir = path.join(__dirname, 'tests');

fs.readdirSync(testDir).filter((file) => {
    // Only keep the .js files
    return file.substr(-3) === '.js';

}).forEach((file) =>  {
    mocha.addFile(
        path.join(testDir, file)
    );
});

mocha.run((failures) => {
    process.exit(failures);
});
