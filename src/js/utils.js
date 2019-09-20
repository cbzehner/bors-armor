/**
 * Access the current active Tab in Chrome and pass the Url as a curry'd value
 * into the function parameter.
 *
 * @param {function} callback
 */
export const fetchActiveTabUrl = async callback => {
  await chrome.tabs.query(
    { active: true, currentWindow: true, url: ["*://github.com/*"] },
    async tabs => {
      if (tabs.length === 0) {
        console.error(`Active tab is not a Github Url: ${tab.url}`)
        return // Active window is not on Github
      }

      const activeTab = tabs[0]

      await callback(activeTab.url)
    }
  )
}

/**
 * Given a valid Github Url reduce it to just the Github Repository Url
 */
export const repoUrlFormat = url => {
  const pieces = url.split("/")
  if (pieces.length < 5) {
    console.error(`Invalid repository url: ${url}`)
    return null // Url is not a valid Github Repo Url
  }

  return pieces.slice(0, 5).join("/")
}
