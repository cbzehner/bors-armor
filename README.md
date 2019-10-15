# bors-armor
Visual chrome for using Bors' Github integration with the Chrome Browser

Replace the existing merge options on a Github Pull Request with a button that comments on the Pull Request with "bors r+"

![Screenshot from 2019-08-25 14 46 19](https://user-images.githubusercontent.com/3886290/63656381-b2ed1c80-c747-11e9-9d5f-89b1a3f0d0cd.png)

# Getting Started
1. Clone the repo and run `yarn install` to fetch the dependencies
1. Build the extension locally with `yarn build` to generate the output files in a format Chrome will accept
1. [Load the unpacked extension](https://developer.chrome.com/extensions/getstarted#manifest) from the `/build` directory in the repository
1. Change the code, run `yarn build` and [reload the extension](chrome://extensions/), to see the changes in action!

# Architecture

Chrome has a standard set of architecture patterns it recommends for all extensions (at least until the [Manifest V3 changes](https://docs.google.com/document/d/1nPu6Wy4LWR66EFLeYInl3NzzhHzc-qnk4w4PX-0XMw8/edit) roll out!). This involves a few different moving parts which communicate via [message passing](https://developer.chrome.com/extensions/messaging). Let's break this down by section and discuss each one and how they fit together to protect our repos from dastardly merges.

## Content Script

The [content script](https://developer.chrome.com/extensions/content_scripts) alters the Github page for any repos protected by Bors Armor. The `manifest.json` file sets the content script to run on [document_end](https://developer.chrome.com/extensions/content_scripts#document_end). The content script first checks if it should run, and if so does the following:

1. Identify the merge panel, which is where Github stores most metadata and actions related to merging a Pull Request into the base branch (generally "master")
1. Copy an existing "merge-status" item for one of the supported merge strategies on Github (merge, squash, rebase) and replace it with Bors-specific language, hiding other strategies
1. Copy an existing "merge-button" item for one of the supported merge strategies on Github (merge, squash, rebase) and replace it with Bors-specific language, hiding other strategies. This is where the majority of the UI logic lives. When creating the Bors button for use in the Github UI, the existing Github status checks are used to determine whether the button should be disabled or not.
1. Copy an existing "button group" for one of the supported merge strategies on Github (merge, squash, rebase) and replace it with Bors-specific language, hiding other strategies

The strategy of copying existing UI elements used for other merge strategies rather than building new elements from scratch for Bors Armor is intended to be robust against Github UI changes, since that's out of the control of this extension.

## Popup

The [popup](https://developer.chrome.com/extensions/user_interface#popup) is a [browser_action](https://developer.chrome.com/extensions/browserAction) that initially checks whether the current URL is protected and alters it's own UI to reflect the current state of the repository being viewed. Once the initial state has been set it allows either activating or deactivating a Github repository by sending a message to the background page to alter the list of stored repository URLs. It then optimistically updates the popup UI.

## Background Page

The [background page](https://developer.chrome.com/extensions/background_pages) essentially functions as a primitive service worker. The background page is intended to tie together functionality across the various user-visible parts of the Chrome extension and within the content script. However, Bors Armor was initially developed as a single content script that ran on every Github repository and then was refactored heavily to use the background page and popup systems common in Chrome extensions. With additional work the background page could probably be used more effectively to direct when the content script runs and ensure Bors Armor remains active even when Github refreshes their UI in the background.

As it stands the background page is responsible for various disparate functionality:
1. Initialize the storage for Bors Armor. By default, the Bors Armor repository is protected.
1. Set the Page Action to active for Github URLs
1. Listen for messages from the popup adding/removing Github repositories
1. Respond to the content script when it attempts to run for a specific browser tab

# Development Notes

In developing Bors Armor, three distinct Github Pull Request UIs need to be taken into account

1. A repo without any status checks enabled
1. A repo with non-Bors status checks enabled
1. A repo with Bors enabled as a status check (Bors' status check remains in a pending state until after it first attempts a merge)

# Distribution

To package Bors Armor for distribution run `yarn zip` and upload the `bors-armor.zip` output file to the Chorme Web Store.

# Acknowledgements
Current icon [Armor by lastspark from the Noun Project](https://thenounproject.com/term/armor/1755705)
