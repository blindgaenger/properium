module.exports = {
    "extends": "standard",
    "installedESLint": true,
    "env": {
      "node": true,
      "mocha": true
    },
    "plugins": [
        "standard",
        "promise",
        "mocha"
    ],
    "rules": {
      "space-before-function-paren": 0
    }
};