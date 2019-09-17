import BorsArmor from "../content"
import { THREE_SECONDS } from "./constants"
import { selectSubmitButton, selectCommentBox } from "./selectors"
import { hideElem } from "./utils"

const replaceMergeButtons = mergePanel => {
  const mergeButtonGroup = mergePanel.querySelector("div.BtnGroup")
  const mergeButtons = mergePanel.querySelectorAll("button.BtnGroup-item")
  const borsButton = mergeButtons[0].cloneNode()

  borsButton.innerText = "Add to Bors queue"
  borsButton.classList.add("btn-group-bors")
  borsButton.classList.remove(
    "btn-group-merge",
    "btn-group-rebase",
    "btn-group-squash"
  )
  borsButton.disabled = false
  delete borsButton.dataset.detailsContainer

  borsButton.onclick = handleBorsClick

  mergeButtonGroup.insertBefore(borsButton, mergeButtons[0])
  Array.from(mergeButtons).map(hideElem)
}

const handleBorsClick = _event => {
  const commentTextArea = selectCommentBox()
  const submitButton = selectSubmitButton()

  const currValue = commentTextArea.value
  commentTextArea.value = "bors r+"

  // If the button is disabled, temporarily enable it
  const isDisabled = submitButton.disabled
  submitButton.disabled = false

  // Restore the existing textarea content ~and button disabled status~ once the submission completes
  const handleRestore = function() {
    // Gotcha: Cannot reuse existing references to HTML elements. Re-select them inside the set-timeout function.
    setTimeout(function() {
      selectSubmitButton().disabled = !currValue || isDisabled

      selectCommentBox().value = currValue

      BorsArmor()
    }, THREE_SECONDS) // Wait three seconds for Github to POST the comment and re-render, then re-run main()
  }

  submitButton.addEventListener("click", handleRestore)
  submitButton.click()

  const manualMergeInstructions = document.querySelector(
    "div.merge-branch-manually"
  )
  hideElem(manualMergeInstructions)
}

export default replaceMergeButtons
