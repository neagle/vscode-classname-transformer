# className to classnames Transformer

## Why?

Tailwind is a lot of fun until you're dealing with long lists of classes in space-separated strings. They stretch wider than your screen, they're hard to scan, they're hard to toggle on and off.

```
className="text-sm md:mt-4 md:text-lg mb-4 md:text-right leading-tight"
```

It's much easier to deal with items in an array, which the [classnames](https://www.npmjs.com/package/classnames) package can turn into a class string.

```
className={classnames(["text-sm", "md:mt-4", "md:text-lg", "mb-4", "md:text-right", "leading-tight"])}
```

Why? Because your autoformatter will turn any sequence of these that's long enough into a beautiful, multi-line segment:

```
className={classnames([
	"text-sm",
	"md:mt-4",
	"md:text-lg",
	"mb-4",
	"md:text-right",
	"leading-tight"
])}
```

This is easier to read, you can add / delete classes easily, and you can easily comment out individual classes as you're developing.

When class strings have a lot of different conditions or permutations, the logic to put them together neatly can quickly get ugly. [Classnames](https://www.npmjs.com/package/classnames) is a very old, simple JavaScript utility for conditionally joining classNames together. It accepts strings, arrays of strings, and objects with true/false conditions and transforms them to a space-separated string.

## Requirements

The code this creates requires the [classnames](https://www.npmjs.com/package/classnames) package to be installed in your project.

```
npm i classnames
```

## Command

In VS Code, bring up your command palette (`Cmd + Shift + P`) and type enough characters to bring up the following command:

- **Convert className Strings to classnames()**


(`classnames` is a small, simple JavaScript utility for conditionally joining classNames together.)

## What it does

Within selected text only, this command converts React class string attributes like:

```tsx
className="btn join-item"
```

to:

```tsx
className={classnames(["btn", "join-item"])}
```

## Behavior

- Works only on selected text.
- Supports multiple matches in one selection.
- Supports class strings with line breaks.
- Makes no edits when no valid `className="..."` or `className='...'` is found in the selection.
- Adds `import classnames from "classnames";` if missing.

## Local development

```bash
npm install
npm run build
```

Press `F5` in this extension folder to launch an Extension Development Host.

## Install (command line)

```bash
code --install-extension vscode-classname-transformer-0.0.1.vsix
```

## Install in VS Code (from prebuilt `.vsix`)

If you already have a released `.vsix` file, install it directly in VS Code:

1. Open **Command Palette** (`Cmd + Shift + P`)
2. Run **Extensions: Install from VSIX...**
3. Select the `.vsix` file

Installing a `.vsix` makes the extension available globally in this VS Code installation (not tied to one project workspace).

## Build/package `.vsix` (maintainers)

```bash
npm install
npm run build
npm run package
```
