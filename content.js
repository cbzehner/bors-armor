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
 * 1) Replace the current implementation with one that replaces all buttons
 *    with the Bors button.
 * 2) Implement the on-click => comment functionality outlined above ^.
 * 3) Disable the select-menu-list options with a message pointing users to Bors Armor
 * 4) Toggle activation of Bors Armor with the Chrome extension
 * 5) Activate Bors Armor by opting-in repositories or users/organizations
 *    instead of using a global config for all of Github
 * 6) Update icon to be a friendly knight
 */
// Select the Merge panel from the Github PR review page.
const mergePanel = document.querySelector('div.merge-message')

// Add Bors as the default merge button
const mergeButtonGroup = mergePanel.querySelector('div.BtnGroup')
const mergeButtons = mergePanel.querySelectorAll('button')
const borsButton = mergeButtons[0].cloneNode()

borsButton.innerText = 'Add to Bors queue'
borsButton.classList.remove('btn-group-merge')
borsButton.classList.remove('btn-group-rebase')
borsButton.classList.remove('btn-group-squash')
borsButton.classList.add('btn-group-bors')
borsButton.onclick = function(event) {
  console.log('event', event)
  event.stopPropogation;
  event.preventDefault;
  alert('Hi! Thanks for flying with Bors!')
}

mergeButtonGroup.insertBefore(borsButton, mergeButtons[0])

// Add Bors as the selected option in the Dropdown menu
const mergeOptionSelector = mergePanel.querySelector('div.BtnGroup > details')
const optionMenu = mergeOptionSelector.querySelector('div.select-menu-list')
const currOption = optionMenu.querySelector('[aria-checked="true"]')
const borsOption = currOption.cloneNode(true)

borsOption.querySelector('span.select-menu-item-heading').innerText = 'Add to Bors queue'
borsOption.querySelector('span.description').innerText = 'The pull request will be added to Bors release queue.'
borsOption.value = 'bors'

optionMenu.insertBefore(borsOption, currOption)
// Uncheck the previously selected option
currOption.setAttribute('aria-checked', "false")

// TODO: Replace "This branch has no conflicts with the base branch" with a Bors-specific message
// const branchActionItem = document.querySelector('div.branch-action-item')
