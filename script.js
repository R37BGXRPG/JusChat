// script.js

document.addEventListener('DOMContentLoaded', () => {
  // Define the URL for the background image
  const FROSTED_GLASS_IMAGE_URL = 'http://googleusercontent.com/file_content/11';

  // Function to apply the saved theme and font from localStorage
  function applySavedSettings() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      // Update the dropdown on the settings page if it exists
      const themeSelect = document.getElementById('theme-select');
      if (themeSelect) {
        themeSelect.value = savedTheme;
      }
    }

    const savedSpecialTheme = localStorage.getItem('specialTheme');
    if (savedSpecialTheme) {
      if (savedSpecialTheme === 'frosted-glass-effect') {
        document.body.style.backgroundImage = `url('${FROSTED_GLASS_IMAGE_URL}')`;
        const mainContentWrapper = document.querySelector('.main-content-wrapper');
        if (mainContentWrapper) {
          mainContentWrapper.classList.add('frosted-glass-effect');
        }
      }
      // Update the dropdown on the settings page if it exists
      const specialThemeSelect = document.getElementById('special-theme-select');
      if (specialThemeSelect) {
        specialThemeSelect.value = savedSpecialTheme;
      }
    }

    const savedFont = localStorage.getItem('font');
    if (savedFont) {
      document.documentElement.setAttribute('data-font', savedFont);
      // Update the dropdown on the settings page if it exists
      const fontSelect = document.getElementById('font-select');
      if (fontSelect) {
        fontSelect.value = savedFont;
      }
    }
  }

  // Initial application of settings on page load
  applySavedSettings();

  // Handle settings page logic
  const themeSelect = document.getElementById('theme-select');
  const specialThemeSelect = document.getElementById('special-theme-select');
  const fontSelect = document.getElementById('font-select');

  if (themeSelect) {
    themeSelect.addEventListener('change', (event) => {
      const selectedTheme = event.target.value;
      document.documentElement.setAttribute('data-theme', selectedTheme);
      localStorage.setItem('theme', selectedTheme);
    });
  }

  if (specialThemeSelect) {
    specialThemeSelect.addEventListener('change', (event) => {
      const mainContentWrapper = document.querySelector('.main-content-wrapper');
      // Clear all special themes first
      document.body.style.backgroundImage = 'none';
      if (mainContentWrapper) {
        mainContentWrapper.classList.remove('frosted-glass-effect');
      }

      const selectedSpecialTheme = event.target.value;
      if (selectedSpecialTheme === 'frosted-glass') {
        document.body.style.backgroundImage = `url('${FROSTED_GLASS_IMAGE_URL}')`;
        if (mainContentWrapper) {
          mainContentWrapper.classList.add('frosted-glass-effect');
        }
      }
      localStorage.setItem('specialTheme', selectedSpecialTheme);
    });
  }

  if (fontSelect) {
    fontSelect.addEventListener('change', (event) => {
      const selectedFont = event.target.value;
      document.documentElement.setAttribute('data-font', selectedFont);
      localStorage.setItem('font', selectedFont);
    });
  }
});

// A helper function to get RGB values for special themes
function getRgbValues(colorVariable) {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(colorVariable).trim();
  if (hex.startsWith('#')) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '255, 255, 255'; // Fallback
}

// Update the CSS custom properties with RGB values for special themes
function updateRgbVariables() {
  const root = document.documentElement;
  const bgRgb = getRgbValues('--bg');
  const boxBgRgb = getRgbValues('--box-bg');
  const borderColorRgb = getRgbValues('--border-color');
  const shadowRgb = getRgbValues('--shadow');

  root.style.setProperty('--bg-rgb', bgRgb);
  root.style.setProperty('--box-bg-rgb', boxBgRgb);
  root.style.setProperty('--border-color-rgb', borderColorRgb);
  root.style.setProperty('--shadow-rgb', shadowRgb);
}

// Listen for theme changes to update RGB variables
window.addEventListener('change', (event) => {
  if (event.target.id === 'theme-select') {
    updateRgbVariables();
  }
});

// Initial call to set RGB variables on page load
updateRgbVariables();
