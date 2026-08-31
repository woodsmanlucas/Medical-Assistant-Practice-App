import { useEffect, useState } from "react";
import { Conversation } from "./conversation";
import uniqid from 'uniqid';

export function Welcome() {

// const model = "llama3.2"
const model = "Goosedev/medbot"

interface ConvoObj {
    response: Boolean,
    text: String,
    id:  Number
}
  const [conversation, setConversation] = useState<Array<ConvoObj>>([{text: "PlaceHolder", response: true, id: 1}])
  const [loading, setLoading] = useState(true);
  const [keyValue, setKeyValue] = useState(1);
  const [readyForInput, setReadyForInput] = useState(false);
  const [request, setRequest] = useState("");
  const [summary, setSummary] = useState("");
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [complete, setComplete] = useState(false);
  const [finalResponse, setFinalResponse] = useState(""); 
  const sessionId = uniqid.time();
  
  useEffect(() => {handleStartQuery()}, []);


  // Create the request headers
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15")
  myHeaders.append("Accept", "*/*")

  const handleRequest = (event: React.ChangeEvent<HTMLInputElement >) => {
    setRequest(event.currentTarget.value)
  }

  const handleConversationInput = async () => {
    setReadyForInput(false);
    console.log("Replying to convo")
    setKeyValue(keyValue+1)
    conversation.push({text: String(request), response: false, id: keyValue});
    console.log(conversation)

      // Create the request
  const myRequest = new Request("http://localhost:11434/api/generate", {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
    model: model,
    prompt: "As the patient your pretending to be," + String(request),
    stream: false,
    sessionId: sessionId
    }),
  });

// Log the request
  console.log("Sending request to:", myRequest.url);
  console.log("Request headers:", myHeaders);
  try{
    fetch(myRequest).then(response => {console.log(response); return response.json()}).then(json => {console.log(json.response); setKeyValue(keyValue+1); conversation.push({text: String(json.response), response: true, id: keyValue}); setReadyForInput(true); console.log(conversation);})
  }catch(e){
    console.log(e)
  }
  }


  const handleSummaryInput = async () => {
    setReadyForInput(false);
    console.log("Sending summary")
    console.log(summary)

      // Create the request
  const myRequest = new Request("http://localhost:11434/api/generate", {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
    model: model,
    prompt: "Here is my summary for our conversation with you as a patient:" + String(summary) + "Could you tell me how I did in gathering information about our conversation?",
    stream: false,
    sessionId: sessionId
    }),
  });

// Log the request
  console.log("Sending request to:", myRequest.url);
  console.log("Request headers:", myHeaders);
  try{
    fetch(myRequest).then(response => {console.log(response); return response.json()}).then(json => {console.log(json.response); setFinalResponse(String(json.response)); setReadyForInput(true); setComplete(true)})
  }catch(e){
    console.log(e)
  }
  }

  const handleStartQuery = async () => {
    const listOfDiseases = ["Alzheimers",
    "Anxiety",
    "Arthritis",
    "Asthma",
    "Back Pain",
    "Bladder health and disorders",
    "Blood pressure",
    "Breast cancer",
    "Cholesterol and lipids",
    "COPD",
    "Colds and flu",
    "Dementia",
    "Depression",
    "Diabetes",
    "Digestive health",
    "Fibromyalgia",
    "Glaucoma",
    "Hands",
    "Headache and migraine",
    "Hearing loss",
    "Heart attack",
    "Heart disease",
    "Heart failure",
    "Inflammation",
    "Irritable bowel syndrome",
    "Lupus",
    "Macular degerneration",
    "Memory",
    "Multiple sclerosis",
    "Osteoporosis", 
    "Pneumonia",
    "Prostate health",
    "Rheumatoid Arthritis",
    "Sciatica",
    "Shoulder pain",
    "Sinusitis",
    "Skin cancer",
    "Sleep",
    "Stress",
    "Tinnitus"
  ]

  const RandomSpotInList = Math.floor(Math.random()*listOfDiseases.length)
  console.log(listOfDiseases[RandomSpotInList])

  interface jsonObj {
    status: string
    result: string
  }



  // Create the request
  const myRequest = new Request("http://localhost:11434/api/generate", {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
    model: model,
    prompt: `Could you generate a list of symptoms for a patient in a doctors office with ${listOfDiseases[RandomSpotInList]}?`,
    stream: false,
    sessionId: sessionId
    }),
  });

  // Log the request
  console.log("Sending request to:", myRequest.url);
  console.log("Request headers:", myHeaders);
  setLoadingPercent(20);

  try{
    fetch(myRequest).then(response => {console.log(response); return response.json()}).then(json => {console.log(json.response);  handleStartConvo()});
  }catch(e){
    console.log(e)
  }
  } 
  
  const handleStartConvo = async () => {
    console.log("Starting convo query")
    setLoadingPercent(70);

      // Create the request
  const myRequest = new Request("http://localhost:11434/api/generate", {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
    model: model,
    prompt: `Now lets pretend you are the patient and I am the medical assistant interviewing you?`,
    stream: false,
    sessionId: sessionId
    }),
  });

// Log the request
  console.log("Sending request to:", myRequest.url);
  console.log("Request headers:", myHeaders);
  try{
    fetch(myRequest).then(response => {console.log(response); return response.json()}).then(json => {console.log(json.response); setConversation([{text: String(json.response), response: true, id: keyValue}]);setLoading(false); setReadyForInput(true);})
  }catch(e){
    console.log(e)
  }
  }


  return (<div>{loading ? (<h1>Loading {loadingPercent}%</h1>) : 
     (<main className="flex flex-row justify-around min-h-0">
      <div className="flex flex-col items-center">
          <div className="w-[500px]">
            <h4>Summary</h4>
            <textarea value={summary} onChange={e => setSummary(e.target.value)} className="border min-h-[200px] w-[500px]"></textarea>
            {readyForInput && <button onClick={handleSummaryInput} className="border bg-green-500/100 cursor-pointer text-white border-black">Submit</button>}
          </div>
        </div>
        <div className="w-[500px]">
          <Conversation convo={conversation}/>
              <div className="flex-row">    
        <input className="border" type="text" value={request} onChange={handleRequest}></input>
        {readyForInput && <button className="border bg-blue-500/100 cursor-pointer text-white border-black" onClick={handleConversationInput}>Respond</button>}
        </div>
        </div>
    </main>)}
     {complete && <p className="p-[50px]">{finalResponse}</p>}
    </div>
  );
}

