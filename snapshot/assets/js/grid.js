/* ============================================================
   Card grid + modal.

   Reads data/items.json, renders a card per entry, and opens a
   modal with the full body text when a card is activated.

   Note: fetch() won't work over file:// — the page must be served
   (locally: `python -m http.server`, live: GitHub Pages).
   ============================================================ */

(function () {
  "use strict";

  var root = document.getElementById("grid");
  if (!root) return;

  var modal = document.getElementById("modal");
  var modalHead = modal.querySelector(".modal-head");
  var modalImage = modal.querySelector(".modal-image");
  var modalTitle = modal.querySelector(".modal-title");
  var modalSubtitle = modal.querySelector(".modal-subtitle");
  var modalBody = modal.querySelector(".modal-body");
  var closeButton = modal.querySelector(".modal-close");
  var footCloseButton = modal.querySelector(".modal-foot-close");
  var panel = modal.querySelector(".modal-panel");

  var lastFocused = null;
  var cardElements = [];

  var prefersReducedMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  /* ---- render ---- */

  function buildCard(item, index) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.dataset.index = index;

    var figure = document.createElement("span");
    figure.className = "card-image";
    if (item.image) {
      var img = document.createElement("img");
      img.src = item.image;
      img.alt = "";
      img.loading = "lazy";
      figure.appendChild(img);
    }
    card.appendChild(figure);

    var title = document.createElement("span");
    title.className = "card-title";
    title.textContent = item.title || "";
    card.appendChild(title);

    if (item.subtitle) {
      var subtitle = document.createElement("span");
      subtitle.className = "card-subtitle";
      subtitle.textContent = item.subtitle;
      card.appendChild(subtitle);
    }

    return card;
  }

  /* ---- modal ---- */

  function openModal(item, trigger) {
    lastFocused = trigger;

    modalImage.innerHTML = "";
    if (item.image) {
      var img = document.createElement("img");
      img.src = item.image;
      img.alt = "";
      modalImage.appendChild(img);
      modalImage.hidden = false;
    } else {
      modalImage.hidden = true;
    }
    // Without an image the head has nothing to sit beside, so the
    // text takes the full width instead of half of it.
    modalHead.classList.toggle("is-textonly", !item.image);

    modalTitle.textContent = item.title || "";

    modalSubtitle.textContent = item.subtitle || "";
    modalSubtitle.hidden = !item.subtitle;

    // Blank lines in the JSON become separate paragraphs.
    modalBody.innerHTML = "";
    String(item.body || "")
      .split(/\n\s*\n/)
      .filter(function (para) { return para.trim(); })
      .forEach(function (para) {
        var p = document.createElement("p");
        p.textContent = para.trim();
        modalBody.appendChild(p);
      });

    modal.hidden = false;
    document.body.classList.add("modal-open");
    // A reopened modal would otherwise keep the previous one's scroll.
    panel.scrollTop = 0;
    closeButton.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocused) lastFocused.focus();
    lastFocused = null;
  }

  // Keep tabbing inside the dialog while it's open.
  function trapFocus(e) {
    if (e.key !== "Tab") return;

    var focusable = modal.querySelectorAll(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ---- load ---- */

  // Groups appear in the order their section name is first seen, so
  // reordering sections means reordering items in the JSON.
  function groupBySection(items) {
    var order = [];
    var bySection = {};

    items.forEach(function (item, index) {
      var name = item.section || "";
      if (!bySection[name]) {
        bySection[name] = [];
        order.push(name);
      }
      bySection[name].push(index);
    });

    return order.map(function (name) {
      return { name: name, indexes: bySection[name] };
    });
  }

  /* ---- questions ----
     Rendered from the same items the cards come from, so a question
     can't end up pointing at a card that was renamed or removed. */

  function revealCard(card) {
    card.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center"
    });

    // preventScroll, or focus() would jump instantly and fight the
    // smooth scroll we just started.
    card.focus({ preventScroll: true });

    clearHighlight();
    card.classList.add("is-highlighted");
  }

  function clearHighlight() {
    cardElements.forEach(function (el) {
      if (el) el.classList.remove("is-highlighted");
    });
  }

  function buildQuestions(items, questions) {
    var list = document.getElementById("questions");
    var section = document.getElementById("questions-section");
    if (!list || !section || !Array.isArray(questions)) return;

    // Card titles are the join key. They read plainly in the data file,
    // and a typo shows up here rather than silently doing nothing.
    var indexByTitle = {};
    items.forEach(function (item, index) {
      indexByTitle[item.title] = index;
    });

    var added = 0;

    questions.forEach(function (entry) {
      var index = indexByTitle[entry.card];

      if (index === undefined) {
        console.warn('Question points at a card that does not exist: "' + entry.card + '"');
        return;
      }

      var li = document.createElement("li");
      var button = document.createElement("button");
      button.type = "button";
      button.className = "question";
      button.textContent = entry.question;
      button.addEventListener("click", function () {
        var card = cardElements[index];
        if (card) revealCard(card);
      });
      li.appendChild(button);
      list.appendChild(li);
      added += 1;
    });

    if (added) section.hidden = false;
  }

  function loadJson(path) {
    return fetch(path).then(function (response) {
      if (!response.ok) throw new Error(path + ": HTTP " + response.status);
      return response.json();
    });
  }

  Promise.all([
    loadJson("data/items.json"),
    // Questions are ordered deliberately and more than one can point at
    // the same card, so they live in their own file rather than as a
    // field on each item.
    loadJson("data/questions.json").catch(function () { return []; })
  ])
    .then(function (loaded) {
      var items = loaded[0];
      var questions = loaded[1];
      root.innerHTML = "";
      if (!Array.isArray(items) || !items.length) return;

      var fragment = document.createDocumentFragment();

      groupBySection(items).forEach(function (group, position) {
        if (position > 0) {
          fragment.appendChild(document.createElement("hr")).className =
            "group-divider";
        }

        var section = document.createElement("section");
        section.className = "group";

        if (group.name) {
          var heading = document.createElement("h2");
          heading.className = "group-title";
          heading.textContent = group.name;
          section.appendChild(heading);
        }

        var grid = document.createElement("div");
        grid.className = "grid";
        group.indexes.forEach(function (index) {
          var card = buildCard(items[index], index);
          cardElements[index] = card;
          grid.appendChild(card);
        });

        section.appendChild(grid);
        fragment.appendChild(section);
      });

      root.appendChild(fragment);
      buildQuestions(items, questions);

      root.addEventListener("click", function (e) {
        var card = e.target.closest(".card");
        if (!card) return;
        // The highlight has done its job once the card is opened.
        clearHighlight();
        openModal(items[card.dataset.index], card);
      });
    })
    .catch(function (error) {
      root.innerHTML = "";
      var message = document.createElement("p");
      message.className = "grid-error";
      message.textContent = "Couldn't load items (" + error.message + ").";
      root.appendChild(message);
    });

  /* ---- close handlers ---- */

  closeButton.addEventListener("click", closeModal);

  // This used to scroll the panel back to its top, which on a short card
  // is a no-op and reads as a dead button. It closes the dialog now.
  footCloseButton.addEventListener("click", closeModal);

  // Click the backdrop, but not the panel itself.
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") closeModal();
    trapFocus(e);
  });
})();
