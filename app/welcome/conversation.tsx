
interface MyConvoProps {
    convo: Array<ConvoObj>
}

interface ConvoObj {
    response: Boolean,
    text: String,
    id:  Number
}

export function Conversation(props: MyConvoProps) {


    return(
    <div className="flex-col flex-start min-h-[200px] w-[500px]">
    <h1>Conversation</h1>
    <div className="overflow-y-auto max-h-[400px]">    
        {props.convo && props.convo.map(textobj => (
            <p className={textobj.response ? "pe-[100px] bg-gray-500" : "ps-[100px] bg-blue-500"}>{textobj.text}</p>
        ))}
    </div>

    </div>
    )
}