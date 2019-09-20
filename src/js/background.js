const initializeBackground = () => {
  initializeStorage()
  setPopupInteractiveWebsite("github.com")
}

/**
 * Set initial values for stored websites
 */
const initializeStorage = () => {
  chrome.storage.sync.set({
    activeRepos: ["https://github.com/cbzehner/bors-armor"],
  })
}

/**
 * Set a website Url where the browser will allow interaction via the popup
 *
 * Source: https://developer.chrome.com/extensions/getstarted#user_interface
 */
const setPopupInteractiveWebsite = url => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: url },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ])
  })
}

/**
 * Handle messages passed to background.js
 */
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  switch (request.message) {
    case "shouldProtect":
      shouldProtectCurrentTab(request.url, sendResponse)
      break
    case "enable":
      protectRepo(request.url)
      break
    case "disable":
      abandonRepo(request.url)
      break
  }

  return true
})

/**
 * Respond to the content script determining whether it should run or not based
 * on whether the current tab exists in sync'd storage.
 */
const shouldProtectCurrentTab = (url, sendResponse) => {
  if (!url) sendResponse({ shouldProtect: false, url: url })

  const currentTabArmored = storageData => {
    const protectedRepos = storageData.activeRepos

    if (protectedRepos.some(repoUrl => repoUrl === url)) {
      sendResponse({ shouldProtect: true, url })
    } else {
      sendResponse({ shouldProtect: false, url })
    }
  }

  chrome.storage.sync.get("activeRepos", currentTabArmored)
}

/**
 * Add a repo to the protected list
 */
const protectRepo = repoUrl => {
  const appendCurrentRepo = storageData => {
    let activeRepos = storageData.activeRepos || []
    activeRepos.push(repoUrl)
    chrome.storage.sync.set({ activeRepos })
  }

  chrome.storage.sync.get("activeRepos", appendCurrentRepo)
}

/**
 * Remove a repo from the protected list
 */
const abandonRepo = repoUrl => {
  const removeCurrentRepo = storageData => {
    let activeRepos = storageData.activeRepos
    activeRepos = activeRepos.filter(activeRepoUrl => activeRepoUrl !== repoUrl)
    chrome.storage.sync.set({ activeRepos })
  }

  chrome.storage.sync.get("activeRepos", removeCurrentRepo)
}

chrome.runtime.onInstalled.addListener(initializeBackground)
