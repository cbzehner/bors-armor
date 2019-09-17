const disableOtherMergeOptions = () => {
  const borsOnlyWarning = document.createElement("span")
  borsOnlyWarning.innerText = "Not enabled due to Bors Armor Chrome plugin."
  borsOnlyWarning.classList.add("unavailable-merge-method")

  // TODO: Refactor to go from the Buttons to children rather than traversing back to parents :/
  const menuTextNodes = document.querySelectorAll(
    "details-menu.select-menu-merge-method > div.select-menu-list > button.select-menu-item > div.select-menu-item-text"
  )
  Array.from(menuTextNodes).forEach(textNodes => {
    if (textNodes.parentElement.value === "bors") {
      return
    }

    // Does not overwrite repository-level warnings. This will only disable methods already allowed by the repo.
    textNodes.appendChild(borsOnlyWarning)
    textNodes.parentElement.disabled = "true"
  })
}

export default disableOtherMergeOptions
