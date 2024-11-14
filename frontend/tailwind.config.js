/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'sans': ['Manrope', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors:{
        'ch-dark-blue-purple': 'rgb(42, 36, 74)',          // Dark blue-purple
        'ch-light-lavender': 'rgb(233, 172, 242)',         // Light lavender
        'ch-pale-pinkish-purple': 'rgb(240, 215, 244)',    // Pale pinkish-purple
        'ch-sky-blue': 'rgb(61, 161, 255)',                // Sky blue
        'ch-very-light-blue': 'rgb(235, 245, 255)',        // Very light blue
        'ch-teal': '#315f74',                              // Teal
        'ch-mint-green': 'rgb(49, 196, 135)',              // Mint green
        'ch-light-mint': 'rgb(235, 252, 244)',             // Light mint
        'ch-brick-red': 'rgb(170, 62, 43)',                // Brick red
        'ch-coral': 'rgb(230, 91, 72)',                    // Coral
        'ch-soft-red': 'rgb(240, 109, 92)',                // Soft red
        'ch-light-peach': 'rgb(255, 237, 235)',            // Light peach
        'ch-mustard-yellow': 'rgb(252, 210, 71)',          // Mustard yellow
        'ch-very-pale-yellow': 'rgb(255, 250, 235)',       // Very pale yellow
        'ch-dark-grey': 'rgb(43, 43, 43)',                 // Dark grey
        'ch-charcoal-grey': 'rgb(51, 49, 50)',             // Charcoal grey
        'ch-medium-grey': 'rgb(92, 87, 87)',               // Medium grey
        'ch-grey': 'rgb(131, 131, 131)',                   // Grey
        'ch-almost-white': 'rgb(250, 250, 250)',           // Almost white
        'ch-white': 'rgb(255, 255, 255)',                  // White
      }
    },
  },
  plugins: [],
}

