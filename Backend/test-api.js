async function test() {
  try {
    const res = await fetch("http://localhost:5001/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test Note", content: "Test Content" })
    });
    console.log("POST STATUS:", res.status);
    const text = await res.text();
    console.log("POST BODY:", text);
  } catch (e) {
    console.log("FETCH ERROR:", e.message);
  }
}
test();
