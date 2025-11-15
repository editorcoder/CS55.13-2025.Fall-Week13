/*
editorcoder
2025-11-13
SRJC CS55.13 Fall 2025
Week 13: Assignment 13: Custom SQL in Headless CMS-Powered App
posts.js
*/

import { got } from "got"; // load got module for HTTP requests
// NOTE: Upgraded to v14 due to issue "Got allows a redirect to a UNIX socket" https://github.com/advisories/GHSA-pfrx-2q88-qq97
// Updated fetchPostData() to work with v14


// define REST endpoint URL
const cardDataURL =
  // custom URL via ACF 
  "https://dev-basic-headless-cms-app.pantheonsite.io/wp-json/wp/v2/card";


// Helper function to fetch and parse JSON data from WordPress API--
// to eliminate repetition across getAllPostIds(), getSortedPostData(), and getPostData()
async function fetchPostsData() {

  let jsonObj; // Declare variable to store parsed JSON data

  try { // Begin error handling block
    // get JSON data from REST endpoint (got v14 automatically parses JSON)
    jsonObj = await got(cardDataURL).json();
    console.log(jsonObj); // Log parsed JSON object for debugging
  } catch (error) { // Handle request errors
    jsonObj = []; // Set empty array as fallback
    console.log(error); // Log error for debugging
  } // End error handling block

  return jsonObj; // Return parsed JSON data

}

// Helper function to fetch WordPress media data by media ID
async function fetchMediaData(mediaId) {

  let mediaObj; // Declare variable to store parsed media data

  try { // Begin error handling block
    // Construct WordPress media API endpoint URL
    const mediaURL = `https://dev-basic-headless-cms-app.pantheonsite.io/wp-json/wp/v2/media/${mediaId}`;
    // get JSON data from REST endpoint (got v14 automatically parses JSON)
    mediaObj = await got(mediaURL).json();
  } catch (error) { // Handle request errors
    mediaObj = null; // Set null as fallback
    console.log(`Error fetching media ${mediaId}:`, error); // Log error for debugging
  } // End error handling block

  return mediaObj; // Return parsed media data or null
}

export async function getAllPostIds() { // Build Next.js dynamic route params for posts

  const jsonObj = await fetchPostsData(); // Fetch posts data from API

  const paths = jsonObj.map(item => { // Map each filename to a params object
    return { // Return object in the shape Next.js expects
      params: { // Route parameters container
        id: item.id.toString() // Convert id to string as required by Next.js
      } // End params object
    } // End return object
  }); // End map function
  return paths; // Return array of path objects

}

export async function getSortedPostsData() { // Read posts and return metadata sorted by date

  const jsonObj = await fetchPostsData(); // Fetch posts data from API

  jsonObj.sort(function (a, b) { // Sort array by post date in descending order
    return b.date.localeCompare(a.date); // Compare dates using locale-aware string comparison
  }); // End sort function

  return jsonObj.map(item => { // Transform each post object to include only needed fields
    return { // Return simplified post object
      id: item.id ? item.id.toString() : null, // Convert id to string
      title: item.acf?.title || '', // Use ACF title field
      date: item.date, // Include post date
    } // End return object
  }) // End map function

}

export async function getPostData(id) { // Read one post and return HTML plus metadata

  const jsonObj = await fetchPostsData(); // Fetch posts data from API

  // find object value in array that has matching id
  const objMatch = jsonObj.filter(obj => { // Filter array to find post with matching ID
    return obj.id === parseInt(id) || obj.id.toString() === id.toString(); // Compare post id with requested id (handle both string and number)
  }); // End filter function

  // extract object value in filtered array if any
  let objReturned; // Declare variable to store matched post object
  if (objMatch.length > 0) { // Check if matching post was found
    objReturned = objMatch[0]; // Use first matching post
  } else { // Handle case when no post matches
    objReturned = {}; // Set empty object as fallback
  } // End if-else block

  // Fetch media URL if photo ID exists
  let photoUrl = ''; // Initialize photo URL variable
  const photoId = objReturned.acf?.photo; // Get photo media ID from ACF
  if (photoId && typeof photoId === 'number') { // Check if photo ID exists and is a number
    const mediaData = await fetchMediaData(photoId); // Fetch media data from WordPress API
    if (mediaData && mediaData.source_url) { // Check if media data was fetched successfully
      photoUrl = mediaData.source_url; // Extract source URL from media response
    } // End if block
  } // End if block

  return { // Return post data object
    id: objReturned.id ? objReturned.id.toString() : '', // Convert id to string or use empty string
    date: objReturned.date || '', // Use post date or empty string
    photoUrl: photoUrl, // WordPress media image URL (fetched from media API)
    // ACF fields
    title: objReturned.acf?.title || '', // Card title
    cost: objReturned.acf?.cost || null, // Card cost
    catnip: objReturned.acf?.catnip || '', // Catnip value
    defense: objReturned.acf?.defense || '', // Defense value
    attack: objReturned.acf?.attack || '', // Attack value
    lives: objReturned.acf?.lives || null, // Lives value
    mechanics: objReturned.acf?.mechanics || '', // Mechanics description
    lore: objReturned.acf?.lore || '', // Lore description    
    photoArtistName: objReturned.acf?.photo_artist_name || '', // Photo artist name
    photoArtistUrl: objReturned.acf?.photo_artist_url || '', // Photo artist URL
    photoSourceUrl: objReturned.acf?.photo_source_url || '', // Photo source URL
  }; // End return object

}


