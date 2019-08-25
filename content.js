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
