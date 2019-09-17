/**
 * Bors Armor: content.js
 *
 * When viewing the "Conversation" tab of a Pull Request on Github
 * replace the Merge options with a button to add the Pull Request
 * to the Bors queue.
 *
 * When clicked the button will:
 * 1) Store the existing contents of the comment textarea, clearing it's value
 * 2) Add the appropriate Bors command to the comment textarea
 * 3) Comment on the PR, activating Bors
 * 4) Restore the previous contents of the comment textarea
 *
 * TODO:
 * 1) Toggle activation of Bors Armor with the Chrome extension
 * 2) Activate Bors Armor by opting-in repositories or users/organizations
 *    instead of using a global config for all of Github
 * 3) Update icon to be a friendly knight
 * 4) Wrap changes in try-catch and throw an alert if the Github UI has breaking changes
 */

import replaceMergeStatus from "./content/replaceStatus"
import replaceMergeButtons from "./content/replaceButton"
import addBorsToMergeOptions from "./content/updateOptions"
import disableOtherMergeOptions from "./content/disableOptions"
import { selectMergePanel } from "./content/selectors"

const main = () => {
  // Select the Merge panel from the Github PR review page.
  const mergePanel = selectMergePanel()

  // Do nothing unless currently on the "Conversations" tab of a Pull Request
  if (!mergePanel) return null

  replaceMergeStatus()
  replaceMergeButtons(mergePanel)
  addBorsToMergeOptions(mergePanel)
  disableOtherMergeOptions()
}

export default main

main() // Run Bors Armor on page load
