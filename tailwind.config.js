/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./django/templates/**/*.html",
  ],
  theme: {
    extend: {
      theme : {
        colors : {
          "main-bg" : "#F9FAFB" 
        }
      }
    },
  },
  plugins: [
    require('tailwindcss'),
    
  ],
}

