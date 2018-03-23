/**
 * serialize a form/object into a url-encoded string
 * @param  {Object} obj    Input to serialize
 * @param  {String} prefix What to prefix keys with (normally null)
 * @return {String}
 */
const serializeObj = (obj, prefix) => {
  let str = []
  let p
  for (p in obj)
    if (obj.hasOwnProperty(p)) {
      let k = prefix ? prefix + "[" + p + "]" : p
      let v = obj[p]
      str.push(
        v !== null && typeof v === "object"
          ? serializeObj(v, k)
          : encodeURIComponent(k) + "=" + encodeURIComponent(v)
      )
    }

  return str.join("&")
}

/**
 * Make a request to the server or provided uri
 * @param  {String} uri     The uri to connect to
 * @param  {String} method  What kind of request to make (GET, PUT, etc.)
 * @param  {Array}  headers What header options to add
 *                          [
 *                            {
 *                              key: "Content-type",
 *                              val: "application/x-www-form-urlencoded"
 *                            }
 *                          ]
 * @param  {Object} body    What data to push
 * @return {Promise}
 */
export const makeRequest = (uri, method, headers, body, response_type, form) => {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest()

    body = body || {}
    method = method || "GET"

    req.open(method, uri)

    req.responseType = response_type || 'json'

    if (
      headers &&
      Array.isArray(headers) &&
      headers.length > 0
    ) for (let i = 0; i < headers.length; i++)
      try {
        req.setRequestHeader(null, headers[i].key, headers[i].value)
      }
      catch (err) {
        return reject(err)
      }

    else if (
      typeof body === "object" &&
      method !== "GET" &&
      !form
    ) {
      body = JSON.stringify(body)
      req.setRequestHeader("Content-type", "application/json")
    }

    req.onreadystatechange = () => {
      if (req.readyState === 4) return resolve(
        {
          status: req.status,
          data: req.response
        }
      )
    }

    req.send(body)
  })
}

export const serialize = serializeObj
