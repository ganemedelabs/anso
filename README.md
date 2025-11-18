# anso

![Version](https://img.shields.io/npm/v/anso)
![Downloads](https://img.shields.io/npm/dw/anso)
![License](https://img.shields.io/npm/l/anso)

The tiniest, fastest, dynamic CLI color library for Node.js.

Add color and style to your terminal output with zero dependencies, lightning-fast performance, and full support for both static and dynamic colors (including hex!).

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [License](#-license)
- [Contact](#-contact)

## ✨ Features

- No dependencies
- Ultra small and lightweight
- Blazing-fast ANSI color/styling
- Supports common styles: `bold`, `italic`, `underline`, `inverse`, `strikethrough`, and more
- 16 standard colors + bright variants
- Background colors
- Dynamic hex color support (`#fff`, `#ff0000`)
- Auto-detects and disables colors in unsupported terminals
- Works seamlessly on Windows, Linux, macOS
- Supports ESM, CJS, and browser environments

## 🔧 Installation

```bash
npm install anso
# or
yarn add anso
```

## 🚀 Usage

```ts
import color from "anso";

// Static colors
console.log(color.red("This is red!"));
console.log(color.bold("Bold text"));
console.log(color.bgBlue("Background blue"));

// Bright colors
console.log(color.greenBright("Bright green text"));

// Dynamic hex colors
console.log(color.f06("Hot pink!"));
console.log(color["00ff7f"]("Spring green"));

// Combined styles
console.log(color.bold(color.underline(color.cyan("Bold, underlined, cyan!"))));
```

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📧 Contact

For inquiries or more information, you can reach out to us at [ganemedelabs@gmail.com](mailto:ganemedelabs@gmail.com).
