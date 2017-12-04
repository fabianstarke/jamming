let accessToken;
let clientId = 'ddf16c1a3ca0434c9b6c1844b0df00c9'
let redirectUri = 'http://fabian_jamming.surge.sh'

export const Spotify = {
  getAccessToken() {
    if(accessToken){
      return accessToken;
    }
    const newAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const newExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

    if(newAccessToken && newExpiresIn){
      accessToken = newAccessToken[1];
      const expiresIn = Number(newExpiresIn[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    }
    else{
     window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&&redirect_uri=${redirectUri}&scope=playlist-modify-public`;
   }
 },

 search(term) {
     return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
         {headers: {Authorization: `Bearer ${accessToken}`}})
       .then(response => response.json())
       .then(jsonResponse => {
         if (jsonResponse.tracks) {
           return jsonResponse.tracks.items.map(track => {
             return {
               id: track.id,
               name: track.name,
               artist: track.artists[0].name,
               album: track.album.name,
               uri: track.uri,
             }
           });
         } else return [];
       })
   },

   savePlaylist(playlistName, trackURIs) {
       if (playlistName && trackURIs.length) {
         const accessToken = Spotify.getAccessToken();
         const headers = {
           Authorization: `Bearer ${accessToken}`
         };
         let userID;
         let playlistID;
         return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => {
           if (response.ok) {
             return response.json();
           }
           throw new Error('Request failed!');
         }, networkError => {
           console.log(networkError.message);
         }).then(jsonResponse => {
           userID = jsonResponse.id;
           return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
             method: 'POST',
             headers: headers,
             body: JSON.stringify({name: playlistName})
           }).then(response => {
             if (response.ok) {
               return response.json();
             }
             throw new Error('Request failed!');
           }, networkError => {
             console.log(networkError.message);
           }).then(jsonResponse => {
             playlistID = jsonResponse.id;
             return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
               method: 'POST',
               headers: headers,
               body: JSON.stringify({uris: trackURIs})
             }).then(response => {
               if (response.ok) {
                 return response.json();
               }
               throw new Error('Request failed!');
             }, networkError => {
               console.log(networkError.message);
             }).then(jsonResponse => jsonResponse);
           });
         });

       } else {
         return;
       }
     }
}
