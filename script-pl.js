function renderBooks(){fetch("books-pl.json").then((t=>t.json())).then((t=>{const e=document.getElementById("book-list");function n(t){e.innerHTML="",t.sort(((t,e)=>t.year.match(/\d+/)[0]>e.year.match(/\d+/)[0]?1:e.year.match(/\d+/)[0]>t.year.match(/\d+/)[0]?-1:0)).forEach((t=>{const n=document.createElement("li");n.className="box",n.innerHTML=`\n\t\t\t\t\t\t<strong>\n\t\t\t\t\t\t\t<a href="https://cdn.solaranamnesis.com/library-test/examples/book_shelf-pl.html#${t.id}">${t.title}</a>\n\t\t\t\t\t\t</strong> — ${t.author} (${t.year}) \t\t\n\t\t\t\t\t\t<br>\n\t\t\t\t\t\t\t<small>\n\t\t\t\t\t\t\t\t<b>Języki:</b> ${t.languages}\n\t\t\t\t\t\t\t</small>\n\t\t\t\t\t\t\t<br>\n\t\t\t\t\t\t\t\t<small>\n\t\t\t\t\t\t\t\t\t<b>Tematy:</b> ${t.subjects}\n\t\t\t\t\t\t\t\t</small>\n            `,e.appendChild(n)}))}function a(t,e,n){return n.indexOf(t)===e}function l(){const e=document.getElementById("language-select").value,a=document.getElementById("year-select").value,l=document.getElementById("subject-select").value,s=document.getElementById("author-select").value;n(t.filter((t=>{const n="Wybierz język"===e||t.languages.includes(e),r="Wybierz rok"===a||t.year.includes(a),c="Wybierz temat"===l||t.subjects.includes(l),o="Wybierz autora"===s||t.author.includes(s);return n&&r&&c&&o})))}function s(t,e){const n=document.getElementById(t);e.forEach((t=>{const e=document.createElement("option");e.value=t,e.textContent=t,n.appendChild(e)}))}const r=t.flatMap((t=>t.languages.split(",").map((t=>t.trim())))).filter(a).sort(),c=t.map((t=>t.year.match(/\d+/)[0])).filter(a).sort(),o=t.flatMap((t=>t.subjects.split(",").map((t=>t.trim())))).filter(a).sort(),d=t.flatMap((t=>t.author.split(",").map((t=>t.trim())))).filter(a).sort();s("language-select",r),s("year-select",c),s("subject-select",o),s("author-select",d),n(t),document.getElementById("language-select").addEventListener("change",l),document.getElementById("year-select").addEventListener("change",l),document.getElementById("subject-select").addEventListener("change",l),document.getElementById("author-select").addEventListener("change",l)})).catch((t=>console.error("Error:",t)))}document.addEventListener("DOMContentLoaded",renderBooks);
