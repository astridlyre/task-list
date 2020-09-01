module.exports = {
  purge: {
    enabled: true,
    content: ["index.html"],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require("@tailwindcss/custom-forms")],
};
