import { selectLastMergeStatusActionItem } from "./selectors"

const replaceMergeStatus = () => {
  const mergeStatusActionItem = selectLastMergeStatusActionItem()

  const rebaseHeader = mergeStatusActionItem.querySelector("div.rebasing-body")
  if (!rebaseHeader) {
    return
  }
  const borsHeader = rebaseHeader.cloneNode(true)

  borsHeader.classList.replace("rebasing-body", "bors-body")
  borsHeader.style.display = "block"
  const statusHeading = borsHeader.querySelector("h3.status-heading")
  statusHeading.innerText = "This branch can be added to the Bors queue"
  const statusDescription = borsHeader.querySelector("span.status-meta")
  statusDescription.innerText =
    "Bors will add this to the merge queue and handle release"

  Array.from(mergeStatusActionItem.children).forEach(hideElem)
  mergeStatusActionItem.appendChild(borsHeader)
}

export default replaceMergeStatus
