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
