const addBorsToMergeOptions = mergePanel => {
  const mergeOptionSelector = mergePanel.querySelector("div.BtnGroup > details")

  if (!mergeOptionSelector) {
    return
  }

  const optionMenu = mergeOptionSelector.querySelector("div.select-menu-list")
  const currOption = optionMenu.querySelector('[aria-checked="true"]')
  const borsOption = currOption.cloneNode(true)

  borsOption.querySelector("span.select-menu-item-heading").innerText =
    "Add to Bors queue"
  borsOption.querySelector("span.description").innerText =
    "The pull request will be added to Bors release queue."
  borsOption.value = "bors"

  optionMenu.insertBefore(borsOption, currOption)
  currOption.setAttribute("aria-checked", "false") // Uncheck the previously selected option
}

export default addBorsToMergeOptions
