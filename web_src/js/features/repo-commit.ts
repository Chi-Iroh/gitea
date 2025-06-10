import {createTippy} from '../modules/tippy.ts';
import {toggleElem} from '../utils/dom.ts';
import $ from 'jquery';

export function initRepoEllipsisButton() {
  for (const button of document.querySelectorAll('.js-toggle-commit-body')) {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const expanded = this.getAttribute('aria-expanded') === 'true';
      toggleElem(this.parentElement.querySelector('.commit-body'));
      this.setAttribute('aria-expanded', String(!expanded));
    });
  }
}

export function initCommitStatuses() {
  for (const element of document.querySelectorAll('[data-tippy="commit-statuses"]')) {
    const top = document.querySelector('.repository.file.list') || document.querySelector('.repository.diff');

    createTippy(element, {
      content: element.nextElementSibling,
      placement: top ? 'top-start' : 'bottom-start',
      interactive: true,
      role: 'dialog',
      theme: 'box-with-header',
    });
  }
}

window.addEventListener("DOMContentLoaded", function () {
  console.log("hello");
  $("input[name=history-enable-follow-renames]").prop("checked", location.toString().includes("history_follow_rename=true"))
})

$("input[name=history-enable-follow-renames]").on("change", function() {
  const checked = $(this).is(":checked");
  let url = location.toString();

  url = url.replaceAll(/history_follow_rename=(true|false)&*/g, "");
  if (url.slice(-1) === '?') {
    url = url.slice(0, url.length - 1);
  }
  if (url.includes("?")) {
    url += "&";
  } else {
    url += "?";
  }

  url += `history_follow_rename=${checked}`;
  window.location.href = url;
})
