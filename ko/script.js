function renderBooks() {
  const loadingIndicator = document.getElementById("loading-indicator");
  const bookList = document.getElementById("book-list");

  // Clear previous books
  bookList.innerHTML = "";

  fetch("books.json")
    .then((res) => res.json())
    .then((allBooks) => {
      if (allBooks && allBooks.length > 0) {
        loadingIndicator.style.display = "none";

        const totalBooks = allBooks.length;
        const selects = {
          language: document.getElementById("language-select"),
          year: document.getElementById("year-select"),
          subject: document.getElementById("subject-select"),
          collection: document.getElementById("collection-select"),
          author: document.getElementById("author-select"),
        };

        function isDefault(selectEl) {
          return selectEl.selectedIndex === 0;
        }

        function extractOptions(books) {
          return {
            language: [
              ...new Set(
                books.flatMap((b) =>
                  b.languages.split(",").map((s) => s.trim()),
                ),
              ),
            ].sort(),
            year: [...new Set(books.map((b) => b.year.match(/\d+/)[0]))].sort(),
            subject: [
              ...new Set(
                books.flatMap((b) =>
                  b.subjects.split(",").map((s) => s.trim()),
                ),
              ),
            ].sort(),
            collection: [
              ...new Set(
                books.flatMap((b) =>
                  b.collections.split(";").map((s) => s.trim()),
                ),
              ),
            ].sort(),
            author: [
              ...new Set(
                books.flatMap((b) => b.author.split(",").map((s) => s.trim())),
              ),
            ].sort(),
          };
        }

        function populateSelect(selectEl, options) {
          const currentValue = selectEl.value;
          const defaultOption = selectEl.options[0];
          selectEl.innerHTML = "";
          selectEl.appendChild(defaultOption);
          options.forEach((opt) => {
            const option = document.createElement("option");
            option.value = opt;
            option.textContent = opt;
            selectEl.appendChild(option);
          });
          // Restore selection if still available
          if (options.includes(currentValue)) {
            selectEl.value = currentValue;
          } else {
            selectEl.selectedIndex = 0;
          }
        }

        function matchesFilter(book, filterKey, value) {
          switch (filterKey) {
            case "language":
              return book.languages.includes(value);
            case "year":
              return book.year.includes(value);
            case "subject":
              return book.subjects.includes(value);
            case "collection":
              return book.collections.includes(value);
            case "author":
              return book.author.includes(value);
          }
          return true;
        }

        // Get books filtered by all selects EXCEPT the excluded one
        function getFilteredBooks(excludeKey) {
          return allBooks.filter((book) => {
            for (const [key, selectEl] of Object.entries(selects)) {
              if (key === excludeKey) continue;
              if (
                !isDefault(selectEl) &&
                !matchesFilter(book, key, selectEl.value)
              ) {
                return false;
              }
            }
            return true;
          });
        }

        function renderBookList(books) {
          bookList.innerHTML = "";
          const resultsCount = document.getElementById("results-count");
          if (resultsCount) {
            if (books.length === totalBooks) {
              resultsCount.textContent = "";
            } else {
              const template =
                resultsCount.getAttribute("data-template") ||
                "Showing {0} of {1} books";
              resultsCount.textContent = template
                .replace("{0}", books.length)
                .replace("{1}", totalBooks);
            }
          }
          books
            .sort((a, b) =>
              a.year.match(/\d+/)[0] > b.year.match(/\d+/)[0]
                ? 1
                : b.year.match(/\d+/)[0] > a.year.match(/\d+/)[0]
                  ? -1
                  : 0,
            )
            .forEach((book) => {
              const li = document.createElement("li");
              li.className = "box";
              li.innerHTML = `\n\t\t\t\t\t\t<strong><em>\n\t\t\t\t\t\t\t<a href="https://cdn.solaranamnesis.com/library-test/examples/book_shelf-ko.html#${book.id}">${book.title}</a>\n\t\t\t\t\t\t</em></strong> — ${book.author
                .split(", ")
                .map((n) =>
                  book.author_url && book.author_url[n]
                    ? '<a href="' +
                      book.author_url[n] +
                      '" target="_blank" rel="noopener noreferrer">' +
                      n +
                      "</a>"
                    : n,
                )
                .join(
                  ", ",
                )} (${book.year}) \t\t\n\t\t\t\t\t\t<br>\n\t\t\t\t\t\t\t<small>\n\t\t\t\t\t\t\t\t<b>언어:</b> ${book.languages}\n\t\t\t\t\t\t\t</small>\n\t\t\t\t\t\t\t<br>\n\t\t\t\t\t\t\t\t<small>\n\t\t\t\t\t\t\t\t\t<b>주제:</b> ${book.subjects}\n\t\t\t\t\t\t\t\t</small>\n            `;
              bookList.appendChild(li);
            });
        }

        function updateFilters() {
          // Cascading: rebuild each dropdown's options from books matching all OTHER filters
          for (const key of Object.keys(selects)) {
            const filteredForThis = getFilteredBooks(key);
            const availableOptions = extractOptions(filteredForThis);
            populateSelect(selects[key], availableOptions[key]);
          }

          // Toggle active class on select wrappers
          for (const selectEl of Object.values(selects)) {
            const wrapper = selectEl.closest(".select");
            if (wrapper) {
              wrapper.classList.toggle("filter-active", !isDefault(selectEl));
            }
          }

          // Filter and render the book list
          const filtered = getFilteredBooks(null);
          renderBookList(filtered);

          // Toggle reset button visibility
          const resetBtn = document.getElementById("reset-filters");
          if (resetBtn) {
            const anyActive = Object.values(selects).some((s) => !isDefault(s));
            resetBtn.style.display = anyActive ? "inline-block" : "none";
          }
        }

        function resetFilters() {
          for (const selectEl of Object.values(selects)) {
            selectEl.selectedIndex = 0;
          }
          updateFilters();
        }

        // Initial population
        const allOptions = extractOptions(allBooks);
        for (const [key, selectEl] of Object.entries(selects)) {
          populateSelect(selectEl, allOptions[key]);
          selectEl.addEventListener("change", updateFilters);
        }

        const resetBtn = document.getElementById("reset-filters");
        if (resetBtn) {
          resetBtn.addEventListener("click", resetFilters);
          resetBtn.style.display = "none";
        }

        renderBookList(allBooks);
      } else {
        // Retry after delay if data is invalid or empty
        console.log(
          "books not found, retrying the request to fetch books json in 1 second...",
        );
        setTimeout(renderBooks, 1000);
      }
    })
    .catch((err) => console.error("Error:", err));
}
document.addEventListener("DOMContentLoaded", renderBooks);
