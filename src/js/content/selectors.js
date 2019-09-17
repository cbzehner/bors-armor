export const selectLastMergeStatusActionItem = () => {
  const branchActionItems = document.querySelectorAll("div.branch-action-item")
  const mergeStatusActionItem = branchActionItems[branchActionItems.length - 1]

  return mergeStatusActionItem
}

export const selectMergePanel = () =>
  document.querySelector("div.merge-message")
