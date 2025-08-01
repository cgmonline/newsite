const fetch = require("node-fetch");

exports.handler = async (event) => {
  const data = JSON.parse(event.body || "{}");
  const { userId, firstName, lastName, organization } = data;

  const tokenRes = await fetch("https://dev-bm83wa86bo4gmb4.us.auth0.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.AUTH0_M2M_CLIENT_ID,
      client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
      audience: "https://dev-bm83wa86bo4gmb4.us.auth0.com/api/v2/",
      grant_type: "client_credentials"
    })
  });

  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.access_token;

  const res = await fetch(`https://dev-bm83wa86bo4gmb4.us.auth0.com/api/v2/users/${userId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      given_name: firstName,
      family_name: lastName,
      user_metadata: { organization }
    })
  });

  if (res.ok) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } else {
    const error = await res.text();
    return {
      statusCode: 500,
      body: error
    };
  }
};
