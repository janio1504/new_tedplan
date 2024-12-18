export async function getData(){
    const response = await fetch('http://172.19.0.3:3333/getPosts')
    const jsonData = await response.json()
    return jsonData
}