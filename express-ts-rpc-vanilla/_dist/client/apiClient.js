export async function apiClient(api, args) {
    console.log('calling api');
    const url = '/api';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ api, args })
    });
    return response.json();
}
// let r1 = apiClient('queryAge', {age: 5})
// console.log(r1);
