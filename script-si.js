function renderBooks() {
    fetch("books-si.json").then((t => t.json())).then((t => {
        const e = document.getElementById("book-list");

        function n(t) {
            e.innerHTML = "", t.sort(((t, e) => t.year.match(/\d+/)[0] > e.year.match(/\d+/)[0] ? 1 : e.year.match(/\d+/)[0] > t.year.match(/\d+/)[0] ? -1 : 0)).forEach((t => {
                const n = document.createElement("li");
                n.className = "box", n.innerHTML = `\n\t\t\t\t\t\t<strong>\n\t\t\t\t\t\t\t<a href="https://cdn.solaranamnesis.com/library-test/examples/book_shelf-si.html#${t.id}">${t.title}</a>\n\t\t\t\t\t\t</strong> — ${t.author} (${t.year}) \t\t\n\t\t\t\t\t\t<br>\n\t\t\t\t\t\t\t<small>\n\t\t\t\t\t\t\t\t<b>භාෂා:</b> ${t.languages}\n\t\t\t\t\t\t\t</small>\n\t\t\t\t\t\t\t<br>\n\t\t\t\t\t\t\t\t<small>\n\t\t\t\t\t\t\t\t\t<b>විෂයයන්:</b> ${t.subjects}\n\t\t\t\t\t\t\t\t</small>\n            `, e.appendChild(n)
            }))
        }

        function a(t, e, n) {
            return n.indexOf(t) === e
        }

        function l() {
            const e = document.getElementById("language-select").value,
                a = document.getElementById("year-select").value,
                l = document.getElementById("subject-select").value,
                c = document.getElementById("author-select").value;
            n(t.filter((t => {
                const n = "භාෂාව තෝරන්න" === e || t.languages.includes(e),
                    s = "වර්ෂය තෝරන්න" === a || t.year.includes(a),
                    o = "විෂය තෝරන්න" === l || t.subjects.includes(l),
                    r = "කර්තෘ තෝරන්න" === c || t.author.includes(c);
                return n && s && o && r
            })))
        }

        function c(t, e) {
            const n = document.getElementById(t);
            e.forEach((t => {
                const e = document.createElement("option");
                e.value = t, e.textContent = t, n.appendChild(e)
            }))
        }
        const s = t.flatMap((t => t.languages.split(",").map((t => t.trim())))).filter(a).sort(),
            o = t.map((t => t.year.match(/\d+/)[0])).filter(a).sort(),
            r = t.flatMap((t => t.subjects.split(",").map((t => t.trim())))).filter(a).sort(),
            d = t.flatMap((t => t.author.split(",").map((t => t.trim())))).filter(a).sort();
        c("language-select", s), c("year-select", o), c("subject-select", r), c("author-select", d), n(t), document.getElementById("language-select").addEventListener("change", l), document.getElementById("year-select").addEventListener("change", l), document.getElementById("subject-select").addEventListener("change", l), document.getElementById("author-select").addEventListener("change", l)
    })).catch((t => console.error("Error:", t)))
}
document.addEventListener("DOMContentLoaded", renderBooks);
