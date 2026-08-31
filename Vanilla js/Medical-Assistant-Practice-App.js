// Create the request headers
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15")
myHeaders.append("Accept", "*/*")

// Create the request
const myRequest = new Request("http://localhost:11434/api/generate", {
  method: "POST",
  headers: myHeaders,
  body: JSON.stringify({
    model: "llama3.2",
    prompt: "why is the sky blue?",
    stream: false
  }),
});

// Log the request
console.log("Sending request to:", myRequest.url);
console.log("Request headers:", myHeaders);

fetch(myRequest).then(response => {console.log(response.status)})