module.exports = {
  purge: {
    enabled: false,
    content: ["index.html"],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require("@tailwindcss/custom-forms")],
};
