function renderBooks(){fetch("books-he.json").then((t=>t.json())).then((t=>{const e=document.getElementById("book-list");function n(t){e.innerHTML="",t.sort(((t,e)=>t.year.match(/\d+/)[0]>e.year.match(/\d+/)[0]?1:e.year.match(/\d+/)[0]>t.year.match(/\d+/)[0]?-1:0)).forEach((t=>{const n=document.createElement("li");n.className="box",n.innerHTML=`\n\t\t\t\t\t\t<strong>\n\t\t\t\t\t\t\t<a href="https://cdn.solaranamnesis.com/library-test/examples/book_shelf-he.html#${t.id}">${t.title}</a>\n\t\t\t\t\t\t</strong> — ${t.author} (${t.year}) \t\t\n\t\t\t\t\t\t<br>\n\t\t\t\t\t\t\t<small>\n\t\t\t\t\t\t\t\t<b>שפות:</b> ${t.languages}\n\t\t\t\t\t\t\t</small>\n\t\t\t\t\t\t\t<br>\n\t\t\t\t\t\t\t\t<small>\n\t\t\t\t\t\t\t\t\t<b>נושאים:</b> ${t.subjects}\n\t\t\t\t\t\t\t\t</small>\n            `,e.appendChild(n)}))}function a(t,e,n){return n.indexOf(t)===e}function l(){const e=document.getElementById("language-select").value,a=document.getElementById("year-select").value,l=document.getElementById("subject-select").value,s=document.getElementById("author-select").value;n(t.filter((t=>{const n="בחר שפה"===e||t.languages.includes(e),c="בחר שנה"===a||t.year.includes(a),o="בחר נושא"===l||t.subjects.includes(l),r="בחר מחבר"===s||t.author.includes(s);return n&&c&&o&&r})))}function s(t,e){const n=document.getElementById(t);e.forEach((t=>{const e=document.createElement("option");e.value=t,e.textContent=t,n.appendChild(e)}))}const c=t.flatMap((t=>t.languages.split(",").map((t=>t.trim())))).filter(a).sort(),o=t.map((t=>t.year.match(/\d+/)[0])).filter(a).sort(),r=t.flatMap((t=>t.subjects.split(",").map((t=>t.trim())))).filter(a).sort(),d=t.flatMap((t=>t.author.split(",").map((t=>t.trim())))).filter(a).sort();s("language-select",c),s("year-select",o),s("subject-select",r),s("author-select",d),n(t),document.getElementById("language-select").addEventListener("change",l),document.getElementById("year-select").addEventListener("change",l),document.getElementById("subject-select").addEventListener("change",l),document.getElementById("author-select").addEventListener("change",l)})).catch((t=>console.error("Error:",t)))}document.addEventListener("DOMContentLoaded",renderBooks);
