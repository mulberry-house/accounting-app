document.getElementById("toggle-menu-form").addEventListener("click", function() {
  const form = document.getElementById("menu-form");
  if (form.style.display === "none") {
    form.style.display = "block";
    this.textContent = "▼ メニューを追加・編集";
  } else {
    form.style.display = "none";
    this.textContent = "▶ メニューを追加・編集";
  }
});

function addMenuItem() {
  const name = document.getElementById("item-name").value;
  const price = document.getElementById("item-price").value;
  if (name && price) {
    alert(`「${name}」を${price}円で追加しました（仮動作）`);
  }
}