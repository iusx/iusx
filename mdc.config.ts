// Preserve Shiki's grammar rules while keeping the blog's neutral and mint palette.
const lightPalette: Record<string, string> = {
  "#24292e": "#3f3f3f",
  "#586069": "#656565",
  "#005cc5": "#555555",
  "#6f42c1": "#007f73",
  "#22863a": "#3f3f3f",
  "#d73a49": "#007f73",
  "#032f62": "#656565",
  "#e36209": "#555555",
  "#b31d28": "#3f3f3f",
  "#fafbfc": "#ffffff",
  "#ffeef0": "#f2f2f2",
  "#f0fff4": "#f2f2f2",
  "#ffebda": "#f2f2f2",
  "#f6f8fa": "#f2f2f2",
};

const darkPalette: Record<string, string> = {
  "#e1e4e8": "#b3b3b3",
  "#d1d5da": "#b3b3b3",
  "#79b8ff": "#d6d6d6",
  "#b392f0": "#38e7cd",
  "#85e89d": "#e0e0e0",
  "#f97583": "#38e7cd",
  "#9ecbff": "#c7c7c7",
  "#ffab70": "#d6d6d6",
  "#fdaeb7": "#e0e0e0",
  "#dbedff": "#c7c7c7",
  "#86181d": "#161616",
  "#144620": "#161616",
  "#c24e00": "#161616",
  "#2f363d": "#161616",
};

// Both GitHub themes use the same comment color, so use one shared neutral gray.
const colorReplacements = {
  ...lightPalette,
  ...darkPalette,
  "#6a737d": "#888888",
};

type ColorReplacementOptions = {
  colorReplacements?: Record<string, string>;
};

export default {
  shiki: {
    transformers: [
      {
        name: "iusx:code-palette",
        preprocess(_code: string, options: ColorReplacementOptions) {
          options.colorReplacements = {
            ...options.colorReplacements,
            ...colorReplacements,
          };
        },
      },
    ],
  },
};
