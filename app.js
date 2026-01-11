let mode = "news";

document.querySelectorAll(".mode").forEach(b => {
  b.onclick = () => {
    document.querySelectorAll(".mode").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    mode = b.dataset.mode;
  };
});

document.getElementById("analyze").onclick = async () => {
  const text = document.getElementById("input").value;
  if (!text) return alert("Paste text");

  document.getElementById("result").innerText = "Analyzing...";

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, mode })
  });

  const data = await res.json();

 document.getElementById("result").innerHTML = `
  <b>Truth:</b> ${data.truth_score}<br>
  <b>Bias:</b> ${data.bias_level}<br>
  <b>Manipulation:</b> ${(data.manipulation || []).join(", ")}<br><br>
  ${data.explanation}
`;

};

