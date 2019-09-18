export const selectLastMergeStatusActionItem = () => {
  const branchActionItems = document.querySelectorAll("div.branch-action-item")
  const mergeStatusActionItem = branchActionItems[branchActionItems.length - 1]

  return mergeStatusActionItem
}

export const selectMergePanel = () =>
  document.querySelector("div.merge-message")

export const selectSubmitButton = () =>
  document.querySelector(
    '#partial-new-comment-form-actions > div > div > button[type="submit"].btn-primary'
  )

export const selectCommentBox = () =>
  document.getElementById("new_comment_field")

export const selectStatusCheckIndicators = () =>
  document.querySelectorAll("div.merge-status-icon > svg.octicon")

export const selectCompletenessChecks = () =>
  document.querySelectorAll("div.completeness-indicator > svg.octicon")

export const selectButtonGroup = panel => panel.querySelector("div.BtnGroup")

export const selectMergeButtons = panel =>
  panel.querySelectorAll("button.BtnGroup-item")

export const selectDropdownMenuButton = panel =>
  panel.querySelector("button.BtnGroup-item.select-menu-button")

export const selectManualMergeInstructions = () =>
  document.querySelector("div.merge-branch-manually")
