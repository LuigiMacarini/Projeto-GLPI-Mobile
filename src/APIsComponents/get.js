import servers from "../pages/Components/servers";


const url = servers();
const API_GET = `${url}`; 
const storedId = await saveId();
const tokenObject = await tokenApi();
const routes = await autoPages();

fetch(`${url}`, {
    
    method: 'POST',
    headers: {
        'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
        'Session-Token': tokenObject,
    },
  });
