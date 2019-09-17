import { THREE_SECONDS } from "./constants"
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
  delete borsButton.dataset.detailsContainer

  borsButton.onclick = function(_event) {
    const commentTextArea = document.getElementById("new_comment_field")
    const submitButton = document.querySelector(
      'div.form-actions > div > button[type="submit"]'
    )

    currValue = commentTextArea.value
    commentTextArea.value = "bors r+"

    // If the button is disabled, temporarily enable it
    const isDisabled = submitButton.disabled
    submitButton.disabled = false

    // Restore the existing textarea content ~and button disabled status~ once the submission completes
    const handleRestore = function() {
      // Gotcha: Cannot reuse existing references to HTML elements. Re-select them inside the set-timeout function.
      setTimeout(function() {
        document.querySelector(
          'div.form-actions > div > button[type="submit"]'
        ).disabled = !currValue || isDisabled

        document.getElementById("new_comment_field").value = currValue

        main()
      }, THREE_SECONDS) // Wait three seconds for Github to POST the comment and re-render, then re-run main()
    }

    submitButton.addEventListener("click", handleRestore)
    submitButton.click()

    const manualMergeInstructions = document.querySelector(
      "div.merge-branch-manually"
    )
    hideElem(manualMergeInstructions)
  }

  mergeButtonGroup.insertBefore(borsButton, mergeButtons[0])
  Array.from(mergeButtons).map(hideElem)
}

export default replaceMergeButtons
