# Changelog

All notable changes to this extension will be documented in this file.

## 0.4.2

- Refactored codebase into a modular `src/` layout: `core/`, `features/`, and `formatter/`.
- Improved script tag and JSX content highlighting in `<script type="jsx">`.
- Added `html-jsx` language mode and `.htmljsx` extension support.
- Added workspace command to associate `.html` files with `html-jsx`.
- Added professional commit system with Conventional Commits and `commitlint` + `husky`.
- Added unit tests for formatter and transforms with CI enforcement.
- Added Pull Request template and contribution guide.

## 0.3.0

- Added built-in formatter support.
- Added range formatting support.
- Added snippets.
- Added commands.
- Added extension settings.
- Added workspace file association command.

## 0.2.0

- Added HTML JSX language mode.
- Added JSX highlighting inside `<script type="jsx">`.

## 0.1.0

- Initial release.