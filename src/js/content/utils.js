import { FAILURE_CHECK_CLASSNAME } from "./constants"
import {
  selectStatusCheckIndicators,
  selectCompletenessChecks,
} from "./selectors"

/**
 * Check that no required statuses and checks are unsuccessful.
 */
export const missingMergeRequirement = () => {
  const completenessChecks = [...selectCompletenessChecks()]

  if (completenessChecks.length === 0) return false

  return failedChecks(completenessChecks)
}

/**
 * Check whether any required checks on this pull request failed.
 */
export const hasFailedStatusChecks = () => {
  const statusCheckIndicators = [...selectStatusCheckIndicators()]

  if (!statusCheckIndicators.length === 0) return false

  return failedChecks(statusCheckIndicators)
}

/**
 * Given a list of svg icons, "oticons", do any have an associated failure class
 *
 * @param {Array<HTMLElement<oticon>>} icons - a list of "oticons"
 */
const failedChecks = icons =>
  icons.some(i => i.classList.contains(FAILURE_CHECK_CLASSNAME))

/**
 * Hide an HTML element
 */
export const hideElem = htmlElem => (htmlElem.style.display = "none")
