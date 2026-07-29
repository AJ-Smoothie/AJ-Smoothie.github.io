---
icon: material/abacus
---

# Live Calculators

A:
<input id="a" type="number">

B:
<input id="b" type="number">

# Result

<div id="result"></div>

<script>
function calc() {
    const a =
        Number(document.getElementById("a").value);

    const b =
        Number(document.getElementById("b").value);

    document.getElementById("result").innerText =
        a + b;
}

document
    .querySelectorAll("input")
    .forEach(input => {
        input.addEventListener("input", calc);
    });

calc();
</script>