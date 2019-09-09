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
const THREE_SECONDS = 3000

const main = () => {
  // Select the Merge panel from the Github PR review page.
  const mergePanel = document.querySelector('div.merge-message')

  // Do nothing unless currently on the "Conversations" tab of a Pull Request
  if (!mergePanel) return null

  replaceMergeStatus()
  replaceMergeButtons(mergePanel)
  addBorsToMergeOptions(mergePanel)
  disableOtherMergeOptions()
}

const replaceMergeStatus = () => {
  const branchActionItems = document.querySelectorAll('div.branch-action-item')
  const mergeStatusActionItem = branchActionItems[branchActionItems.length - 1]

  const rebaseHeader = mergeStatusActionItem.querySelector('div.rebasing-body')
  if (!rebaseHeader) {
    return
  }
  const borsHeader = rebaseHeader.cloneNode(true)

  borsHeader.classList.replace('rebasing-body', 'bors-body')
  borsHeader.style.display = 'block'
  const statusHeading = borsHeader.querySelector('h3.status-heading')
  statusHeading.innerText = 'This branch can be added to the Bors queue'
  const statusDescription = borsHeader.querySelector('span.status-meta')
  statusDescription.innerText = 'Bors will add this to the merge queue and handle release'

  Array.from(mergeStatusActionItem.children).forEach(hideElem)
  mergeStatusActionItem.appendChild(borsHeader)
}

const replaceMergeButtons = (mergePanel) => {
  const mergeButtonGroup = mergePanel.querySelector('div.BtnGroup')
  const mergeButtons = mergePanel.querySelectorAll('button.BtnGroup-item')
  const borsButton = mergeButtons[0].cloneNode()

  borsButton.innerText = 'Add to Bors queue'
  borsButton.classList.add('btn-group-bors')
  borsButton.classList.remove('btn-group-merge','btn-group-rebase', 'btn-group-squash')
  delete borsButton.dataset.detailsContainer

  borsButton.onclick = function(_event) {
    const commentTextArea = document.getElementById('new_comment_field')
    const submitButton = document.querySelector('div.form-actions > div > button[type="submit"]')

    currValue = commentTextArea.value
    commentTextArea.value = 'bors r+'

    // If the button is disabled, temporarily enable it
    const isDisabled = submitButton.disabled
    submitButton.disabled = false

    // Restore the existing textarea content ~and button disabled status~ once the submission completes
    const handleRestore = function() {

      // Gotcha: Cannot reuse existing references to HTML elements. Re-select them inside the set-timeout function.
      setTimeout(function() {
        document.querySelector('div.form-actions > div > button[type="submit"]').disabled = !currValue || isDisabled
        

        document.getElementById('new_comment_field').value = currValue

        main()
      }, THREE_SECONDS); // Wait three seconds for Github to POST the comment and re-render, then re-run main()

    }

    submitButton.addEventListener("click", handleRestore)
    submitButton.click()

    const manualMergeInstructions = document.querySelector('div.merge-branch-manually')
    hideElem(manualMergeInstructions)
  }

  mergeButtonGroup.insertBefore(borsButton, mergeButtons[0])
  Array.from(mergeButtons).map(hideElem)
}

const addBorsToMergeOptions = (mergePanel) => {
  const mergeOptionSelector = mergePanel.querySelector('div.BtnGroup > details')

  if (!mergeOptionSelector) {
    return
  }

  const optionMenu = mergeOptionSelector.querySelector('div.select-menu-list')
  const currOption = optionMenu.querySelector('[aria-checked="true"]')
  const borsOption = currOption.cloneNode(true)

  borsOption.querySelector('span.select-menu-item-heading').innerText = 'Add to Bors queue'
  borsOption.querySelector('span.description').innerText = 'The pull request will be added to Bors release queue.'
  borsOption.value = 'bors'

  optionMenu.insertBefore(borsOption, currOption)
  currOption.setAttribute('aria-checked', "false") // Uncheck the previously selected option
}

const disableOtherMergeOptions = () => {
  const borsOnlyWarning = document.createElement('span')
  borsOnlyWarning.innerText = 'Not enabled due to Bors Armor Chrome plugin.'
  borsOnlyWarning.classList.add('unavailable-merge-method')

  // TODO: Refactor to go from the Buttons to children rather than traversing back to parents :/
  const menuTextNodes = document.querySelectorAll('details-menu.select-menu-merge-method > div.select-menu-list > button.select-menu-item > div.select-menu-item-text')
  Array.from(menuTextNodes).forEach(textNodes => {
    if (textNodes.parentElement.value === 'bors') {
      return
    }

    // Does not overwrite repository-level warnings. This will only disable methods already allowed by the repo.
    textNodes.appendChild(borsOnlyWarning)
    textNodes.parentElement.disabled = "true"
  })
}

const hideElem = (htmlElem) => htmlElem.style.display = 'none'

main()