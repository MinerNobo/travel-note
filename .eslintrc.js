module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier", "react"],
  extends: ["taro/react"],
  rules: {
    "prettier/prettier": "error",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "import/no-commonjs": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "jsx-quotes": ["error", "prefer-double"],
  },
};
