import { TIMEOUT_SEC } from "./config.js";

/**
 * Timeout function to handle delayed responses.
 * @param {number} s - Number of seconds before the request times out.
 * @returns {Promise} - A promise that rejects after the specified timeout.
 */
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`)); // Reject with an error message after timeout
    }, s * 1000); // Convert seconds to milliseconds
  });
};

/**
 * Unified function for making both GET and POST HTTP requests.
 * @param {string} url - The API URL to fetch data from.
 * @param {Object} [uploadData=undefined] - Optional data to be sent in the body of a POST request.
 * @returns {Promise<Object>} - The parsed response data from the API.
 * @throws {Error} - Throws an error if the request fails or times out.
 */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    // Determine if it's a GET or POST request based on the presence of uploadData
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST", // Use POST method if uploadData is provided
          headers: {
            "Content-Type": "application/json", // Specify that the content is JSON
          },
          body: JSON.stringify(uploadData), // Convert uploadData object to a JSON string
        })
      : fetch(url); // Use GET method if no uploadData is provided

    // Fetch the data with a race condition between the API call and the timeout
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // Race between fetch and timeout
    const data = await res.json(); // Parse the response data as JSON

    // Throw an error if the response status is not OK (status code >= 400)
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data; // Return the parsed response data
  } catch (err) {
    throw err; // Rethrow the error for further handling
  }
};
