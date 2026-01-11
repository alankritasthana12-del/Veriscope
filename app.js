let mode = "news";

document.querySelectorAll(".mode").forEach(b => {
  b.onclick = () => {
    document.querySelectorAll(".mode").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    mode = b.dataset.mode;
  };
});

document.getElementById("analyze").onclick = async () => {
  const text = document.getElementById("input").value.trim();
  if (!text) return alert("Paste something first");

  document.getElementById("explanation").innerText = "Analyzing…";

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, mode })
    });

    const data = await res.json();

    if (data.error) {
      document.getElementById("explanation").innerText = "AI Error: " + data.error;
      return;
    }

    document.getElementById("truthBar").style.width = data.truth_score + "%";
    document.getElementById("truthValue").innerText = data.truth_score + "%";

    document.getElementById("bias").innerText = data.bias_level;

    const list = document.getElementById("manipulation");
    list.innerHTML = "";
    (data.manipulation || []).forEach(m => {
      const li = document.createElement("li");
      li.innerText = m;
      list.appendChild(li);
    });

    document.getElementById("explanation").innerText = data.explanation;

  } catch (e) {
    document.getElementById("explanation").innerText = "Connection error.";
  }
};

