let mode = "news";

document.querySelectorAll(".mode").forEach(b => {
  b.onclick = () => {
    document.querySelectorAll(".mode").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    mode = b.dataset.mode;
  };
});

document.getElementById("analyze").onclick = async () => {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return alert("Paste text");

  document.getElementById("explanation").innerText = "Analyzing...";

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, mode })
  });

  const data = await res.json();

  // error block
  if (data.error) {
    document.getElementById("explanation").innerText = "AI Error: " + data.error;
    return;
  }

  // ===== SUCCESS BLOCK =====

  // Truth bar
  document.getElementById("truthBar").style.width = data.truth_score + "%";
  document.getElementById("truthValue").innerText = data.truth_score;

  // Bias
  document.getElementById("bias").innerText = data.bias_level;

  // Manipulation tags
  const tags = document.getElementById("tags");
  tags.innerHTML = "";
  (data.manipulation || []).forEach(t => {
    const span = document.createElement("span");
    span.innerText = t;
    span.style.marginRight = "6px";
    span.style.color = "#38bdf8";
    tags.appendChild(span);
  });

  // Explanation
  document.getElementById("explanation").innerText = data.explanation;

  // History
  const h = document.createElement("div");
  h.innerText = text.slice(0, 60);
  h.onclick = () => { input.value = text; };
  document.getElementById("historyList").prepend(h);
};
