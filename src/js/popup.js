/**
 * Bors Armor: popup.js
 *
 * Add the appropriate message passing to the buttons in popup.html
 */

import { fetchActiveTabUrl, repoUrlFormat } from "./utils"
import {
  selectEnableRepo,
  selectDisableRepo,
  selectTitleActive,
  selectTitleInactive,
} from "./content/selectors"

/**
 * Main method for popup.js
 *
 * Call fetchActiveTabUrl providing a callback that sets up Popup.js correctly.
 */
const initializePopup = async () => {
  await fetchActiveTabUrl(setActivationStateForCurrentTab)
}

/**
 * Pass a message to the background page disabling Bors Armor for this Repo
 */
const handleDisableClick = async () => {
  const sendDisableRepo = url => {
    chrome.runtime.sendMessage(
      { message: "disable", type: "repo", url: repoUrlFormat(url) },
      setPopupUI(false)
    )
  }

  await fetchActiveTabUrl(sendDisableRepo)
}

/**
 * Pass a message to the background page disabling Bors Armor for this Repo
 */
const handleEnableClick = async () => {
  const sendEnableRepo = url => {
    chrome.runtime.sendMessage(
      { message: "enable", type: "repo", url: repoUrlFormat(url) },
      setPopupUI(true)
    )
  }

  await fetchActiveTabUrl(sendEnableRepo)
}

/**
 * Based on the values present in the Storage API calculate whether the
 * current Url has Bors Armor active or inactive.
 */
const setActivationStateForCurrentTab = activeTabUrl => {
  const currentUrl = activeTabUrl
  chrome.storage.sync.get("activeRepos", data => {
    const activeRepos = data.activeRepos
    const isCurrentTabActive =
      activeRepos && activeRepos.some(url => currentUrl.includes(url))

    setPopupUI(isCurrentTabActive)
  })
}

/**
 * Update the UI of Popup.js based on the active state of the current tab
 */
const setPopupUI = isActive => {
  setPopupTitle(isActive)
  setCurrentOption(isActive)
}

/**
 * Set the title for the current Tab in the popup.js
 */
const setPopupTitle = isActive => {
  let displayTitle
  let hiddenTitle
  if (isActive) {
    displayTitle = selectTitleActive()
    hiddenTitle = selectTitleInactive()
  } else {
    hiddenTitle = selectTitleActive()
    displayTitle = selectTitleInactive()
  }
  displayTitle.style.display = "inline"
  hiddenTitle.style.display = "none"
}

/**
 * Disable the option which corresponds to the current state of Bors Armor
 * and enable the corresponding option.
 *
 * If Bors Armor is active, disable the "Enable" option and
 * enable the "Disable" option
 *
 * If Bors Armor is inactive, disable the "Disable" option and enable
 * the "Enable" option
 */
const setCurrentOption = isActive => {
  let activeOption
  let disabledOption
  if (isActive) {
    disabledOption = selectEnableRepo()
    activeOption = selectDisableRepo()
  } else {
    activeOption = selectEnableRepo()
    disabledOption = selectDisableRepo()
  }

  activeOption.style.cursor = "pointer"
  activeOption.style.opacity = "1"
  activeOption.style.textDecoration = undefined
  if (isActive) {
    activeOption.onclick = handleDisableClick
  } else {
    activeOption.onclick = handleEnableClick
  }

  disabledOption.style.cursor = "not-allowed"
  disabledOption.style.opacity = "0.5"
  disabledOption.style.textDecoration = "none"
  disabledOption.onclick = () => {} // Replace onclick handler with empty function
}

initializePopup()
