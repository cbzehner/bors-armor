/**
 * Bors Armor: popup.js
 *
 * Add the appropriate message passing to the buttons in popup.html
 */

const enableRepo = document.querySelector('div.toggle-bors.repo')
enableRepo.onclick = function() {
  chrome.runtime.sendMessage({ enable: true, { type: 'repo' }})
}

const enableOrg = document.querySelector('div.toggle-bors.org')
enableOrg.onclick = function() {
  chrome.runtime.sendMessage({ enable: true, { type: 'org' }})
}

const disableArmor = document.querySelector('div.toggle-bors.disable')
disableArmor.onclick = function() {
  chrome.runtime.sendMessage({ enable: false })
}
