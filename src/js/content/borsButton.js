import BorsArmor from "../content"
import { THREE_SECONDS, BORS_ENQUEUE_MESSAGE } from "./constants"
import {
  selectSubmitButton,
  selectCommentBox,
  selectManualMergeInstructions,
} from "./selectors"
import {
  hideElem,
  missingMergeRequirement,
  hasFailedStatusChecks,
} from "./utils"

export const createBorsButton = mergeButton => {
  const borsButton = mergeButton.cloneNode()

  borsButton.innerText = "Add to Bors queue"
  borsButton.classList.add("btn-group-bors")
  borsButton.classList.remove(
    "btn-group-merge",
    "btn-group-rebase",
    "btn-group-squash"
  )
  delete borsButton.dataset.detailsContainer
  borsButton.onclick = handleBorsClick

  // Set the disabled status of the Bors button
  const isBorsDisabled = hasFailedStatusChecks()
  borsButton.disabled = isBorsDisabled

  if (!isBorsDisabled && !missingMergeRequirement()) {
    // Set primary CTA on button if no failures are detected
    borsButton.classList.add("btn-primary")
  }

  return borsButton
}

const handleBorsClick = _event => {
  const commentTextArea = selectCommentBox()
  const submitButton = selectSubmitButton()

  const currValue = commentTextArea.value
  commentTextArea.value = BORS_ENQUEUE_MESSAGE

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

  hideElem(selectManualMergeInstructions())
}
