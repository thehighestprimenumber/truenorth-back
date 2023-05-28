module.exports = {
    root: true, env: {
        es6: true, node: true,
    }, extends: [
        "eslint:recommended", "plugin:import/errors", "plugin:import/warnings", "plugin:import/typescript", "google", "plugin:@typescript-eslint/recommended",
    ], parser: "@typescript-eslint/parser", parserOptions: {
        sourceType: "module",
    }, ignorePatterns: [
        "/lib/**/*", // Ignore built files.
    ], plugins: [
        "@typescript-eslint", "import",
    ], rules: {
        "quotes": ["error", "double"],
        "import/no-unresolved": 0,
        "indent": ["error", 4],
        "max-len": ["warn", 160],
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "require-jsdoc": "off",
        "@typescript-eslint/no-var-requires": "off",
        "guard-for-in": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
    },
};
