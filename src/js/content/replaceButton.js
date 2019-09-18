import {
  selectButtonGroup,
  selectMergeButtons,
  selectDropdownMenuButton,
} from "./selectors"
import { hideElem } from "./utils"
import { createBorsButton } from "./borsButton"

const replaceMergeButtons = mergePanel => {
  const mergeButtonGroup = selectButtonGroup(mergePanel)
  const mergeButtons = [...selectMergeButtons(mergePanel)]
  const borsButton = createBorsButton(mergeButtons[0])

  mergeButtonGroup.insertBefore(borsButton, mergeButtons[0])
  Array.from(mergeButtons).map(hideElem)

  // If the button group contains a select-menu-button (now hidden)
  // apply some extra CSS to the Bors Button to match Github's UI
  if (selectDropdownMenuButton(mergePanel)) {
    borsButton.classList.add("rounded-right-1")
    borsButton.classList.remove("border-right-0")
    borsButton.style.borderRightWidth = "1px"
  }
}

export default replaceMergeButtons
